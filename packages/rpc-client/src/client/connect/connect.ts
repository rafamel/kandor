import { Subject } from 'rxjs';
import WebSocket from 'isomorphic-ws';
import { connectEach } from './each';
import {
  ConnectionActions,
  ConnectionStatus,
  ConnectionEvent,
  Connection
} from './types';
import { createTracker } from './tracker';

export const RECONNECT_DELAY = 5000;

export function connect(
  address: string,
  wsco: WebSocket.ClientOptions,
  attempts: number,
  timeout: number
): Connection {
  let retries = 0;
  const events$ = new Subject<ConnectionEvent>();

  let child = trunk();
  function trunk(
    delay?: number
  ): { actions: ConnectionActions; status: ConnectionStatus } {
    retries++;
    let active = true;
    // Reset retries when a request and a response have been successful
    const tracker = createTracker(() => {
      retries = 0;
    });

    const connection = connectEach(address, wsco, timeout, delay);
    const subscription = connection.events$.subscribe({
      next(value) {
        if (!active) return;
        events$.next(value);

        if (value.event === 'message') tracker.response();
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

    function close(retry: boolean): void {
      if (!active) return;
      active = false;

      connection.actions.close();
      setTimeout(() => subscription.unsubscribe(), 0);

      if (retry && (attempts <= 0 || attempts > retries)) {
        child = trunk(RECONNECT_DELAY);
      } else {
        events$.complete();
      }
    }

    return {
      get status(): ConnectionStatus {
        return active ? connection.status : 'close';
      },
      actions: {
        close: () => {
          if (!active) return;
          events$.next({ event: 'close', data: null });
          close(false);
        },
        send: (data: string) => {
          return connection.actions.send(data).then(() => tracker.request());
        }
      }
    };
  }

  return {
    get status() {
      return child.status;
    },
    actions: {
      send: (data: string) => child.actions.send(data),
      close: () => child.actions.close()
    },
    events$: events$.asObservable()
  };
}
