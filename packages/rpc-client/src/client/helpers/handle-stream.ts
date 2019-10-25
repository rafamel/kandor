import { UnsubscribePolicy } from '../types';
import { RPCSubscribeRequest } from '@karmic/rpc-adapter';
import { ClientManager } from '../client-manager';
import { Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { resolvableWait, ResolvableWait } from './resolvable-wait';
import { Promist, deferred } from 'promist';

export const ONLY_FAIL_ON_CLOSE_RETRY_WAIT = 5000;

export function handleStreamRequest(
  partial: Pick<RPCSubscribeRequest, 'route' | 'data'>,
  manager: ClientManager,
  responseTimeout: number,
  subscribeOnlyFailOnClose: boolean,
  unsubscribePolicy: UnsubscribePolicy,
  nextId: () => string
): Observable<any> {
  let count = 0;
  let explicitUnsubscribe = false;
  let current: null | {
    id: string;
    isUnsubscribed: boolean;
    observable: Observable<any>;
  } = null;

  const create = (): {
    id: string;
    isUnsubscribed: boolean;
    observable: Observable<any>;
  } => {
    let isUnsubscribed = false;
    const id = nextId();
    const a = manager.stream({
      id,
      action: 'subscribe',
      route: partial.route,
      data: partial.data
    });
    const b = withResponseTimeout(a, manager, responseTimeout, () => {
      if (!isUnsubscribed) {
        isUnsubscribed = true;
        manager.unsubscribe(
          { id, action: 'unsubscribe' },
          Error(`Request reached timeout: ${responseTimeout}ms`)
        );
      }
    });
    const c = onlyFailOnClose(
      b,
      partial,
      manager,
      responseTimeout,
      subscribeOnlyFailOnClose,
      unsubscribePolicy,
      nextId
    );
    return {
      id,
      get isUnsubscribed() {
        return c.didError || isUnsubscribed;
      },
      observable: c.observable
    };
  };

  return new Observable((self) => {
    if (current === null) {
      if (explicitUnsubscribe && unsubscribePolicy === 'complete') {
        self.complete();
        return;
      }
      explicitUnsubscribe = false;
      current = create();
    }

    count++;
    let done = false;
    const subscription = current.observable.subscribe({
      next: (value) => {
        self.next(value);
      },
      error: (err) => {
        done = true;
        self.error(err);
      },
      complete: () => {
        done = true;
        self.complete();
      }
    });

    return () => {
      count--;
      subscription.unsubscribe();
      if (count > 0 || done) return;

      if (unsubscribePolicy !== 'keep-alive') {
        if (current && !current.isUnsubscribed) {
          manager.unsubscribe({ id: current.id, action: 'unsubscribe' });
        }
        explicitUnsubscribe = true;
        current = null;
      }
    };
  });
}

export function withResponseTimeout(
  observable: Observable<any>,
  manager: ClientManager,
  timeout: number,
  onTimeout?: () => void
): Observable<any> {
  if (!timeout) return observable;

  let state: null | {
    promise: Promist<void, 'deferrable'>;
    subscription: Subscription;
  } = null;
  let timer: null | NodeJS.Timer = null;

  let count = 0;
  function start(): void {
    count++;
    if (state) return;

    const promise = deferred();
    const subscription = manager.status$.subscribe((status) => {
      if (status === 'open') {
        stop();
        timer = setTimeout(() => promise.resolve(), timeout);
      } else if (status === 'close') {
        stop();
      }
    });
    state = { promise, subscription };
    promise.then(() => (timer && onTimeout ? onTimeout() : null));
  }
  function stop(): void {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function end(): void {
    count--;
    if (count <= 0) {
      stop();
      if (state) {
        state.promise.resolve();
        state.subscription.unsubscribe();
        state = null;
      }
    }
  }

  return new Observable((self) => {
    start();
    let open = true;
    const subscription = observable.subscribe({
      next: (value) => {
        if (!open) return;
        stop();
        self.next(value);
      },
      error: (err) => {
        if (!open) return;
        stop();
        self.error(err);
        close();
      },
      complete: () => {
        if (!open) return;
        stop();
        self.complete();
        close();
      }
    });

    function close(): void {
      open = false;
      end();
      setTimeout(() => subscription.unsubscribe(), 0);
    }

    return () => {
      if (open) close();
    };
  });
}

export function onlyFailOnClose(
  observable: Observable<any>,
  partial: Pick<RPCSubscribeRequest, 'route' | 'data'>,
  manager: ClientManager,
  responseTimeout: number,
  subscribeOnlyFailOnClose: boolean,
  unsubscribePolicy: UnsubscribePolicy,
  nextId: () => string
): { didError: boolean; observable: Observable<any> } {
  let obs: null | Observable<any> = null;
  let sourceDidError = false;

  return {
    get didError(): boolean {
      return sourceDidError;
    },
    observable: subscribeOnlyFailOnClose
      ? new Observable((self) => {
          let unsubscribed = false;
          let retryWait: null | ResolvableWait = null;
          let subscription = observable.subscribe({
            next: (value) => self.next(value),
            error: (err) => {
              sourceDidError = true;
              if (manager.status === 'complete') return self.error(err);

              manager.report(err);
              retryWait = resolvableWait(ONLY_FAIL_ON_CLOSE_RETRY_WAIT);
              retryWait.promise.then(() => {
                if (unsubscribed) return;
                if (manager.status === 'complete') return self.error(err);

                if (!obs) {
                  obs = handleStreamRequest(
                    partial,
                    manager,
                    responseTimeout,
                    subscribeOnlyFailOnClose,
                    unsubscribePolicy,
                    nextId
                  );
                }
                subscription.unsubscribe();
                subscription = obs.subscribe(self);
              });
            },
            complete: () => self.complete()
          });

          manager.status$
            .pipe(
              filter((x) => x === 'complete'),
              take(1)
            )
            .toPromise()
            .then(() => {
              if (retryWait) retryWait.resolve();
            });

          return () => {
            unsubscribed = true;
            subscription.unsubscribe();
            if (retryWait) retryWait.resolve();
          };
        })
      : observable
  };
}
