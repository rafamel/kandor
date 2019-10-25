import { Subscription, isObservable, Observable } from 'rxjs';
import { PublicError, GeneralError } from '@karmic/core';
import { RPCResponse, RPCError } from './types';
import { createErrors } from './helpers/create-errors';

export default class ChannelMananger {
  private ids: { [key: string]: boolean };
  private subscriptions: { [key: string]: Subscription };
  private errors: { [P in GeneralError | 'RouteError']: PublicError };
  private send: (response: RPCResponse) => void;
  public constructor(
    errors: ReturnType<typeof createErrors>,
    send: (data: RPCResponse) => void
  ) {
    this.ids = {};
    this.subscriptions = {};
    this.errors = errors;
    this.send = send;
  }
  public exists(id: string): boolean {
    return Object.hasOwnProperty.call(this.ids, id);
  }
  public isSubscription(id: string): boolean {
    return Object.hasOwnProperty.call(this.subscriptions, id);
  }
  public error(id: string, error: GeneralError | 'RouteError' | Error): void {
    this.ids[id] = true;
    return this.send({
      id,
      status: 'error',
      data: this.rpcError(
        typeof error === 'string' ? this.errors[error] : error
      )
    });
  }
  public open<T>(id: string, source: Observable<T> | Promise<T>): void {
    this.ids[id] = true;
    if (isObservable(source)) {
      this.subscriptions[id] = source.subscribe({
        next: (data: any) => {
          if (!this.isOpen(id)) return;
          return this.send({ id, status: 'success', data });
        },
        error: (err: Error) => {
          if (!this.isOpen(id)) return;
          this.send({ id, status: 'error', data: this.rpcError(err) });
          this.close(id);
        },
        complete: () => {
          if (!this.isOpen(id)) return;
          this.send({ id, status: 'complete' });
          this.close(id);
        }
      });
    } else {
      source
        .then((data) => {
          if (!this.isOpen(id)) return;
          this.send({ id, status: 'success', data });
          this.close(id);
        })
        .catch((err) => {
          if (!this.isOpen(id)) return;
          this.send({ id, status: 'error', data: this.rpcError(err) });
          this.close(id);
        });
    }
  }
  public close(id: string, unsubscribe?: boolean): void {
    if (!Object.hasOwnProperty.call(this.ids, id) || !this.isOpen(id)) {
      return;
    }

    this.ids[id] = false;
    if (Object.hasOwnProperty.call(this.subscriptions, id)) {
      this.subscriptions[id].unsubscribe();
      delete this.subscriptions[id];
      if (unsubscribe) this.send({ id, status: 'unsubscribe' });
    }
  }
  public destroy(): void {
    for (const id of Object.keys(this.ids)) {
      this.close(id);
    }
  }
  private isOpen(id: string): boolean {
    return this.ids[id] || false;
  }
  private rpcError(err: Error): RPCError {
    return err instanceof PublicError
      ? {
          id: err.id,
          code: err.code,
          message: err.message || undefined
        }
      : {
          id: this.errors.ServerError.id,
          code: this.errors.ServerError.code,
          message: this.errors.ServerError.message || undefined
        };
  }
}
