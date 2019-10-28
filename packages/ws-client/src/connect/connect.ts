import { Subject } from 'rxjs';
import WebSocket from 'isomorphic-ws';
import { connectEach } from './each';
import { createTracker } from './tracker';
import {
  RPCClientConnectionEvent,
  RPCClientConnectionActions,
  RPCClientConnectionStatus,
  RPCClientConnection,
  DataOutput
} from '@karmic/rpc';
import { safeTrigger } from '@karmic/core';

export const RECONNECT_DELAY = 5000;

export function connect(
  address: string,
  wsco: WebSocket.ClientOptions,
  attempts: number,
  timeout: number
): RPCClientConnection {
  let retries = 0;
  const events$ = new Subject<RPCClientConnectionEvent>();

  let child = trunk();
  function trunk(
    delay?: number
  ): {
    actions: RPCClientConnectionActions;
    status: RPCClientConnectionStatus;
  } {
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

    function close(retry: boolean): void {
      if (!active) return;
      active = false;

      connection.actions.close();
      safeTrigger(
        () => Boolean(subscription),
        () => subscription.unsubscribe()
      );

      if (retry && (attempts <= 0 || attempts > retries)) {
        child = trunk(RECONNECT_DELAY);
      } else {
        events$.complete();
      }
    }

    const send = async (data: DataOutput): Promise<void> => {
      return connection.actions.send(data);
    };
    return {
      get status() {
        return active ? connection.status : 'close';
      },
      actions: {
        close: () => {
          if (!active) return;
          events$.next({ event: 'close', data: null });
          close(false);
        },
        send: (data: DataOutput) => {
          return send(data).then(() => tracker.request());
        }
      }
    };
  }

  return {
    get status() {
      return child.status;
    },
    actions: {
      send: (data: DataOutput) => child.actions.send(data),
      close: () => child.actions.close()
    },
    events$: events$.asObservable()
  };
}
