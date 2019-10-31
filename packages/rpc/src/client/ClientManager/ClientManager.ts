import { BehaviorSubject, Observable, throwError, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { retrySubscribe } from './helpers/retry-subscribe';
import {
  RPCUnaryRequest,
  RPCStreamRequest,
  RPCCompleteNotification,
  RPCNotification,
  RPCSingleResponse,
  DataParser
} from '~/types';
import { ConnectionManager } from './ConnectionManager';
import { ClientStore } from './ClientStore';
import { RPCClientConnection, RPCClientStatus } from '~/client/types';
import { mapError } from './helpers/map-error';
import { until, Promist } from 'promist';

const FILTER = {};

export class ClientManager {
  private store: ClientStore;
  private connection: ConnectionManager;
  private subscription: Subscription;
  private subscriptionConnectRetry: boolean;
  public constructor(
    connection: RPCClientConnection,
    parser: DataParser,
    subscriptionConnectRetry: boolean
  ) {
    this.store = new ClientStore();
    this.connection = new ConnectionManager(connection, parser, (data) =>
      this.response(data)
    );
    this.subscriptionConnectRetry = subscriptionConnectRetry;
    this.subscription = this.connection.status$.subscribe((status) => {
      if (subscriptionConnectRetry && status === 'open') {
        for (const id of this.store.ids('stream')) {
          if (!this.store.exists(id, 'retries')) {
            const stream = this.store.getStream(id);
            if (stream) {
              retrySubscribe(stream.request, this.connection, this.store);
            }
          }
        }
      }
      if (status === 'close') {
        this.interrupt(!this.subscriptionConnectRetry);
      }
      if (status === 'complete') {
        this.close();
      }
    });
  }
  public get status(): RPCClientStatus {
    return this.connection.status;
  }
  public get errors(): Error[] {
    return this.connection.errors;
  }
  public get status$(): Observable<RPCClientStatus> {
    return this.connection.status$;
  }
  public get errors$(): Observable<Error> {
    return this.connection.errors$;
  }
  public report(err: Error): void {
    return this.connection.report(err);
  }
  public close(): void {
    this.connection.close();
    this.interrupt(true);
    until(() => Boolean(this.subscription)).then(() => {
      return this.subscription.unsubscribe();
    });
  }
  public unary(
    id: number | string,
    method: string,
    params?: object | null
  ): Promise<any> {
    try {
      if (
        !id ||
        this.store.exists(id, 'history') ||
        this.store.exists(id, 'unary') ||
        this.store.exists(id, 'stream')
      ) {
        return Promise.reject(Error(`Invalid duplicate request id: ${id}`));
      }

      const destination = new Promist();
      const request: RPCUnaryRequest = {
        jsonrpc: '2.0',
        id,
        method,
        params: params || null,
        stream: false
      };

      this.store.setUnary(id, { request, destination });
      this.connection.send(request).catch((err) => {
        this.error(id, err, true);
      });
      return Promise.resolve(destination);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public stream(
    id: number | string,
    method: string,
    params?: object | null
  ): Observable<any> {
    try {
      if (
        !id ||
        this.store.exists(id, 'history') ||
        this.store.exists(id, 'unary') ||
        this.store.exists(id, 'stream')
      ) {
        return throwError(Error(`Invalid duplicate request id: ${id}`));
      }

      const destination = new BehaviorSubject<any>(FILTER);
      const request: RPCStreamRequest = {
        jsonrpc: '2.0',
        id,
        method,
        params: params || null,
        stream: true
      };

      this.store.setStream(id, { request, destination });
      if (!this.subscriptionConnectRetry) {
        this.connection.send(request).catch((err) => this.error(id, err, true));
      } else {
        retrySubscribe(request, this.connection, this.store);
      }
      return destination.pipe(filter((x) => x !== FILTER));
    } catch (err) {
      return throwError(err);
    }
  }
  public unsubscribe(id: number | string, error?: Error): void {
    try {
      if (!id || !this.store.exists(id, 'stream')) {
        return this.report(Error(`Invalid unsubscribe id: ${id}`));
      }

      const retry = this.store.getRetry(id);
      if (retry) {
        retry.stop(
          this.status === 'open' ? () => this.unsubscribe(id) : undefined
        );
      } else if (this.status === 'open') {
        const request: RPCCompleteNotification = {
          jsonrpc: '2.0',
          method: ':complete',
          params: { id }
        };

        this.connection.send(request).catch((err) => this.report(err));
      }

      return error ? this.error(id, error, true) : this.complete(id, true);
    } catch (err) {
      return this.report(err);
    }
  }
  private response(data: any): void {
    try {
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return this.report(
          Error(`Unexpected response: ${JSON.stringify(data)}`)
        );
      }

      // Notification
      if (!Object.hasOwnProperty.call(data, 'id')) {
        const notification: RPCNotification = data;
        if (
          notification.method === ':complete' &&
          notification.params &&
          notification.params.id
        ) {
          return this.complete(notification.params.id, false);
        }
        return this.report(
          Error(`Unexpected notification: ${JSON.stringify(notification)}`)
        );
      }

      // Response
      const response: RPCSingleResponse = data;

      if (response.error) {
        const error = mapError(response);
        return response.id
          ? this.error(response.id, error, false)
          : this.report(error);
      }

      if (response.result && response.id) {
        return this.success(response.id, response.result, false);
      }

      this.report(Error(`Invalid response: ${JSON.stringify(response)}`));
    } catch (err) {
      this.report(err);
    }
  }
  private success(
    id: string | number,
    data: any,
    ignoreHistory: boolean
  ): void {
    if (ignoreHistory && this.store.exists(id, 'history')) {
      return;
    }

    const unary = this.store.getUnary(id);
    if (unary) {
      unary.destination.resolve(data);
      this.store.setUnary(id, null);
      return this.store.setHistory(id, true);
    }

    const stream = this.store.getStream(id);
    if (stream) {
      return stream.destination.next(data);
    }

    this.report(Error(`Invalid success response id: ${id}`));
  }
  private error(
    id: string | number,
    error: Error,
    ignoreHistory: boolean
  ): void {
    if (ignoreHistory && this.store.exists(id, 'history')) {
      return;
    }

    const unary = this.store.getUnary(id);
    if (unary) {
      unary.destination.reject(error);
      this.store.setUnary(id, null);
      return this.store.setHistory(id, false);
    }

    const stream = this.store.getStream(id);
    if (stream) {
      stream.destination.error(error);
      this.store.setStream(id, null);
      return this.store.setHistory(id, false);
    }

    this.report(Error(`Invalid error response id: ${id}`));
  }
  private complete(id: string | number, ignoreHistory: boolean): void {
    if (ignoreHistory && this.store.exists(id, 'history')) {
      return;
    }

    if (this.store.exists(id, 'unary')) {
      this.report(
        Error(`Invalid completion notification for unary request: ${id}`)
      );
    }

    const stream = this.store.getStream(id);
    if (stream) {
      stream.destination.complete();
      this.store.setStream(id, null);
      return this.store.setHistory(id, true);
    }

    this.report(Error(`Invalid id on completion notification: ${id}`));
  }
  private interrupt(stream: boolean): void {
    const error = Error(`Connection has been interrupted`);
    for (const id of this.store.ids('unary')) {
      this.error(id, error, true);
    }
    for (const id of this.store.ids('retries')) {
      const retry = this.store.getRetry(id);
      if (retry) retry.stop();
    }
    if (stream) {
      for (const id of this.store.ids('stream')) {
        this.error(id, error, true);
      }
    }
  }
}
