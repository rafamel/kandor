import { Subscription, Observable } from 'rxjs';
import { PublicError } from '@karmic/core';
import { RPCNotification, RPCErrorResponse, RPCSingleResponse } from '~/types';
import { getError, EnsureErrorType, GetErrorType } from '../errors';

export class ChannelManager {
  private active: { [key: string]: boolean };
  private subscriptions: { [key: string]: Subscription };
  private ensure: (error: EnsureErrorType) => PublicError;
  public constructor(ensure: (error: EnsureErrorType) => PublicError) {
    this.active = {};
    this.subscriptions = {};
    this.ensure = ensure;
  }
  public exists(id: string | number): boolean {
    return Object.hasOwnProperty.call(this.active, this.toStringId(id));
  }
  public isSubscription(id: string | number): boolean {
    return Boolean(this.getSubscription(id));
  }
  public error(
    id: string | number | null,
    error: GetErrorType | Error,
    cb: (data: RPCErrorResponse) => void
  ): void {
    cb({
      jsonrpc: '2.0',
      id,
      error: getError(typeof error === 'string' ? error : this.ensure(error))
    });
    if (typeof id !== 'object') {
      this.setActive(id, true);
      this.close(id);
    }
  }
  public unary<T>(
    id: string | number,
    source: Promise<T>,
    cb: (data: RPCSingleResponse) => void
  ): void {
    this.setActive(id, true);

    source
      .then((data) => {
        if (!this.getActive(id)) return;
        cb({
          jsonrpc: '2.0',
          id,
          result: data
        });
        this.close(id);
      })
      .catch((err) => {
        if (!this.getActive(id)) return;
        cb({
          jsonrpc: '2.0',
          id,
          error: getError(this.ensure(err))
        });
        this.close(id);
      });
  }
  public stream<T>(
    id: string | number,
    source: Observable<T>,
    cb: (data: RPCSingleResponse | RPCNotification) => void
  ): void {
    this.setActive(id, true);

    let hasEmitted = false;
    this.setSubscription(
      id,
      source.subscribe({
        next: (data: any) => {
          if (!this.getActive(id)) return;
          hasEmitted = true;
          cb({
            jsonrpc: '2.0',
            id,
            result: data
          });
        },
        error: (err: Error) => {
          if (!this.getActive(id)) return;
          hasEmitted = true;
          cb({
            jsonrpc: '2.0',
            id,
            error: getError(this.ensure(err))
          });
          this.close(id);
        },
        complete: () => {
          if (!this.getActive(id)) return;
          if (hasEmitted) {
            cb({
              jsonrpc: '2.0',
              method: ':complete',
              params: { id }
            });
          } else {
            // If no values have been emitted
            // before :complete, we emit an error
            cb({
              jsonrpc: '2.0',
              id,
              error: getError(this.ensure('EarlyComplete'))
            });
          }
          this.close(id);
        }
      })
    );
  }
  public close(id: string | number): void {
    if (!this.getActive(id)) return;

    this.setActive(id, false);
    const subscription = this.getSubscription(id);
    if (subscription) {
      subscription.unsubscribe();
      this.setSubscription(id, null);
    }
  }
  public destroy(): void {
    for (const id of Object.keys(this.active)) {
      this.close(this.fromStringId(id));
    }
  }
  private getActive(id: string | number): boolean {
    return this.active[this.toStringId(id)] || false;
  }
  private setActive(id: string | number, active: boolean): void {
    this.active[this.toStringId(id)] = active;
  }
  private getSubscription(id: string | number): Subscription | null {
    return this.subscriptions[this.toStringId(id)] || null;
  }
  private setSubscription(
    id: string | number,
    subscription: Subscription | null
  ): void {
    if (subscription) {
      this.subscriptions[this.toStringId(id)] = subscription;
    } else {
      delete this.subscriptions[this.toStringId(id)];
    }
  }
  private toStringId(id: string | number): string {
    return `${typeof id}:${id}`;
  }
  private fromStringId(id: string): string | number {
    const [type, ...str] = id.split(':');
    return type === 'number' ? parseInt(str[0]) : str.join(':');
  }
}
