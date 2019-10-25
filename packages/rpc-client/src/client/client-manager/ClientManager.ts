import { PendingRequests, ConnectionManager } from './types';
import { deferred } from 'promist';
import {
  RPCUnaryRequest,
  RPCSubscribeRequest,
  RPCUnsubscribeRequest,
  RPCResponse
} from '@karmic/rpc-adapter';
import { BehaviorSubject, Observable, throwError, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import WebSocket from 'isomorphic-ws';
import { PublicError, ErrorCode } from '@karmic/core';
import { connect, Connection } from '../connect';
import { createConnectionManager } from './connection-manager';
import { RPCClientStatus } from '../types';
import { retrySubscribe } from './retry-subscribe';

const FILTER = {};
export const MIN_UNSUBSCRIBE_TIMEOUT = 5000;

export class ClientManager {
  private history: { [key: string]: boolean };
  private pending: PendingRequests;
  private connection: Connection;
  private manager: ConnectionManager;
  private subscription: Subscription;
  private unsubscribeTimeout: number;
  private subscriptionConnectRetry: boolean;
  public constructor(
    address: string,
    wsco: WebSocket.ClientOptions,
    attempts: number,
    connectTimeout: number,
    unsubscribeTimeout: number,
    subscriptionConnectRetry: boolean
  ) {
    this.history = {};
    this.pending = { unary: {}, stream: {}, retries: {}, unsubscribe: {} };
    this.connection = connect(
      address,
      wsco,
      attempts,
      connectTimeout
    );
    this.manager = createConnectionManager(this.connection, (data) => {
      return this.response(data);
    });
    this.unsubscribeTimeout = unsubscribeTimeout;
    this.subscriptionConnectRetry = subscriptionConnectRetry;
    this.subscription = this.manager.status$.subscribe((status) => {
      if (subscriptionConnectRetry && status === 'open') {
        for (const id of Object.keys(this.pending.stream)) {
          if (!Object.hasOwnProperty.call(this.pending.retries, id)) {
            const { request } = this.pending.stream[id];
            retrySubscribe(
              request,
              this.connection,
              this.manager,
              this.pending
            );
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
    return this.manager.status;
  }
  public get errors(): Error[] {
    return this.manager.errors;
  }
  public get status$(): Observable<RPCClientStatus> {
    return this.manager.status$;
  }
  public get errors$(): Observable<Error> {
    return this.manager.errors$;
  }
  public report(err: Error): void {
    return this.manager.actions.report(err);
  }
  public close(): void {
    this.manager.actions.close();
    this.interrupt(true);
    setTimeout(() => this.subscription.unsubscribe(), 0);
  }
  public unary(request: RPCUnaryRequest): Promise<any> {
    try {
      if (!request.id) {
        return Promise.reject(Error(`Invalid request id: ${request.id}`));
      }
      switch (request.action) {
        case 'query':
        case 'mutate': {
          if (
            Object.hasOwnProperty.call(this.history, request.id) ||
            Object.hasOwnProperty.call(this.pending.unary, request.id) ||
            Object.hasOwnProperty.call(this.pending.stream, request.id)
          ) {
            return Promise.reject(
              Error(`Invalid duplicate request id: ${request.id}`)
            );
          }
          const destination = deferred();
          this.pending.unary[request.id] = { request, destination };
          this.connection.actions.send(JSON.stringify(request)).catch((err) => {
            this.error(request.id, err, true);
          });
          return destination.then((x) => x);
        }
        default: {
          return Promise.reject(
            Error(`Invalid request action: ${request.action}`)
          );
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public stream(request: RPCSubscribeRequest): Observable<any> {
    try {
      if (!request.id) {
        return throwError(Error(`Invalid request id: ${request.id}`));
      }
      switch (request.action) {
        case 'subscribe': {
          if (
            Object.hasOwnProperty.call(this.history, request.id) ||
            Object.hasOwnProperty.call(this.pending.unary, request.id) ||
            Object.hasOwnProperty.call(this.pending.stream, request.id)
          ) {
            return throwError(
              Error(`Invalid duplicate request id: ${request.id}`)
            );
          }
          const destination = new BehaviorSubject<any>(FILTER);
          this.pending.stream[request.id] = { request, destination };
          if (!this.subscriptionConnectRetry) {
            this.connection.actions
              .send(JSON.stringify(request))
              .catch((err) => this.error(request.id, err, true));
          } else {
            retrySubscribe(
              request,
              this.connection,
              this.manager,
              this.pending
            );
          }
          return destination.pipe(filter((x) => x !== FILTER));
        }
        default: {
          return throwError(`Invalid request action: ${request.action}`);
        }
      }
    } catch (err) {
      return throwError(err);
    }
  }
  public unsubscribe(request: RPCUnsubscribeRequest, error?: Error): void {
    if (!request.id || request.action !== 'unsubscribe') {
      return this.report(
        Error(`Invalid unsubscribe request: ${JSON.stringify(request)}`)
      );
    }
    if (!Object.hasOwnProperty.call(this.pending.stream, request.id)) {
      return this.report(
        Error(`Unsubscribe attempt for invalid id: ${request.id}`)
      );
    }

    if (Object.hasOwnProperty.call(this.pending.retries, request.id)) {
      this.pending.retries[request.id].stop(
        this.connection.status === 'open'
          ? () => this.unsubscribe(request)
          : undefined
      );
    } else if (this.connection.status === 'open') {
      this.connection.actions
        .send(JSON.stringify(request))
        .then(() => {
          this.pending.unsubscribe[request.id] = setTimeout(() => {
            this.report(
              Error(`Server didn't confirm unsubscribe for ${request.id}`)
            );
          }, Math.max(MIN_UNSUBSCRIBE_TIMEOUT, this.unsubscribeTimeout));
        })
        .catch((err) => this.report(err));
    }

    return error
      ? this.error(request.id, error, true)
      : this.complete(request.id, true);
  }
  private response(response: WebSocket.Data): void {
    try {
      const json: RPCResponse = JSON.parse(String(response));
      switch (json.status) {
        case 'success': {
          return this.success(json.id, json.data, false);
        }
        case 'error': {
          return this.error(
            json.id,
            new PublicError(
              json.data.id,
              json.data.code as ErrorCode,
              null,
              json.data.message,
              true
            ),
            false
          );
        }
        case 'complete': {
          return this.complete(json.id, false);
        }
        case 'unsubscribe': {
          if (Object.hasOwnProperty.call(this.pending.unsubscribe, json.id)) {
            clearTimeout(this.pending.unsubscribe[json.id]);
            delete this.pending.unsubscribe[json.id];
          } else {
            this.report(Error(`Invalid unsubscribe response id: ${json.id}`));
          }
          return;
        }
        default: {
          throw Error(`Unexpected response status: ${JSON.stringify(json)}`);
        }
      }
    } catch (err) {
      this.report(err);
    }
  }
  private success(id: string, data: any, ignoreHistory: boolean): void {
    if (ignoreHistory && Object.hasOwnProperty.call(this.history, id)) {
      return;
    }

    if (Object.hasOwnProperty.call(this.pending.unary, id)) {
      this.pending.unary[id].destination.resolve(data);
      delete this.pending.unary[id];
      this.history[id] = true;
    } else if (Object.hasOwnProperty.call(this.pending.stream, id)) {
      this.pending.stream[id].destination.next(data);
    } else {
      this.report(Error(`Invalid success response id: ${id}`));
    }
  }
  private error(id: string, error: Error, ignoreHistory: boolean): void {
    if (ignoreHistory && Object.hasOwnProperty.call(this.history, id)) {
      return;
    }

    if (Object.hasOwnProperty.call(this.pending.unary, id)) {
      this.pending.unary[id].destination.reject(error);
      delete this.pending.unary[id];
      this.history[id] = false;
    } else if (Object.hasOwnProperty.call(this.pending.stream, id)) {
      this.pending.stream[id].destination.error(error);
      delete this.pending.stream[id];
      this.history[id] = false;
    } else {
      this.report(Error(`Invalid error response id: ${id}`));
    }
  }
  private complete(id: string, ignoreHistory: boolean): void {
    if (ignoreHistory && Object.hasOwnProperty.call(this.history, id)) {
      return;
    }

    if (Object.hasOwnProperty.call(this.pending.unary, id)) {
      this.report(Error(`Invalid completion for unary request id: ${id}`));
    } else if (Object.hasOwnProperty.call(this.pending.stream, id)) {
      this.pending.stream[id].destination.complete();
      delete this.pending.stream[id];
      this.history[id] = true;
    } else {
      this.report(Error(`Invalid complete response id: ${id}`));
    }
  }
  private interrupt(stream: boolean): void {
    const error = Error(`Connection has been interrupted`);
    for (const id of Object.keys(this.pending.unary)) {
      this.error(id, error, true);
    }
    for (const [key, value] of Object.entries(this.pending.unsubscribe)) {
      clearTimeout(value);
      delete this.pending.unsubscribe[key];
    }
    for (const value of Object.values(this.pending.retries)) {
      value.stop();
    }
    if (stream) {
      for (const id of Object.keys(this.pending.stream)) {
        this.error(id, error, true);
      }
    }
  }
}
