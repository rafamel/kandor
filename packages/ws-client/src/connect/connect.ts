import { Subject } from 'rxjs';
import WebSocket from 'isomorphic-ws';
import { connectEach } from './each';
import { createTracker } from './tracker';
import {
  RPCClientConnectionEvent,
  RPCClientConnection,
  DataOutput
} from '@karmic/rpc';
import { until, Promist } from 'promist';

export const RECONNECT_DELAY = 5000;

export function connect(
  address: string,
  context: object,
  wso: WebSocket.ClientOptions,
  attempts: number,
  timeout: number
): RPCClientConnection {
  let retries = 0;
  const events$ = new Subject<RPCClientConnectionEvent>();
  let timer: null | NodeJS.Timer = null;
  let current = new Promist<Pick<RPCClientConnection, 'actions' | 'status'>>();

  function trunk(): void {
    retries++;
    let active = true;
    // Reset retries when a request and a response have been successful
    const tracker = createTracker(() => {
      retries = 0;
    });

    const connection = connectEach(address, context, wso, timeout);
    const subscription = connection.events$.subscribe({
      next(value) {
        if (!active) return;
        events$.next(value);

        if (value.event === 'data') tracker.response();
        else if (value.event === 'close') close(true);
      },
      error(error) {
        if (!active) return;
        events$.next({ event: 'close', data: error });
        close(true);
      },
      complete() {
        if (!active) return;
        events$.next({
          event: 'close',
          data: Error(
            `Inner connection completed without an explicit call or an error`
          )
        });
        close(true);
      }
    });

    current.resolve({
      get status() {
        return active ? connection.status : 'close';
      },
      actions: {
        close: () => {
          if (!active) return;
          events$.next({ event: 'close', data: null });
          close(false);
        },
        async send(data: DataOutput) {
          await connection.actions.send(data);
          tracker.request();
        }
      }
    });

    function close(retry: boolean): void {
      if (!active) return;
      active = false;

      connection.actions.close();
      until(() => Boolean(subscription), true).then(() => {
        return subscription.unsubscribe();
      });

      if (retry && (attempts <= 0 || attempts > retries)) {
        current = new Promist();
        timer = setTimeout(() => {
          timer = null;
          trunk();
        }, Math.max(RECONNECT_DELAY, 50));
      } else {
        events$.complete();
      }
    }
  }

  trunk();
  let closed = false;
  return {
    get status() {
      return current.value && !closed ? current.value.status : 'close';
    },
    actions: {
      async send(data: DataOutput) {
        if (closed) throw Error(`Can't request over a closed socket`);
        return current.then(({ actions }) => actions.send(data));
      },
      close: () => {
        if (closed) return;
        closed = true;

        if (current.value) {
          return current.value.actions.close();
        }
        if (timer) {
          clearTimeout(timer);
          return events$.complete();
        }
      }
    },
    events$: events$.asObservable()
  };
}
