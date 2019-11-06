import WebSocket from 'isomorphic-ws';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  RPCClientConnection,
  RPCClientConnectionStatus,
  RPCClientConnectionEvent,
  DataOutput
} from '@karmic/rpc';
import { Promist } from 'promist';
import { ensure } from 'errorish';

// It's duck typing day
export const isNative = !Object.hasOwnProperty.call(WebSocket, 'Server');

export function connectEach(
  address: string,
  wso: WebSocket.ClientOptions,
  timeout?: number
): RPCClientConnection {
  let active = true;
  let status: RPCClientConnectionStatus = 'close';
  const events$ = new Subject<RPCClientConnectionEvent>();
  const earlyClose = new Promist<RPCClientConnectionEvent>();

  if (timeout && timeout > 0) {
    const timeoutWait = Promist.wait(timeout);
    earlyClose.then(() => timeoutWait.resolve());
    timeoutWait.then(() => {
      if (!active || status === 'open') return;
      close(
        Error(`Connection didn't open by timeout: ${timeout}ms`),
        true,
        false
      );
    });
  }

  let socket: null | WebSocket = null;
  try {
    socket = isNative ? new WebSocket(address) : new WebSocket(address, wso);
  } catch (err) {
    // failing asynchronously; if it fails synchronously
    // events$ will complete before it is subscribed to on ./connect.ts
    setTimeout(() => close(err, false, false), 0);
  }
  let send: (data: any) => Promise<void> = () => {
    return Promise.reject(Error(`Can't request over a closed socket`));
  };
  if (socket) {
    const fn = socket.send.bind(socket);
    send = isNative
      ? async (data: any) => fn(data)
      : (data: any) => {
          return new Promise((resolve, reject) =>
            fn(data, (err) => (err ? reject(err) : resolve()))
          );
        };
  }

  function onopen(): void {
    if (!active) return;
    status = 'open';
    events$.next({ event: 'open' });
  }
  function onerror(event: { error: any }): void {
    if (!active) return;
    close(ensure(event.error), true, false);
  }
  function onclose(): void {
    if (!active) return;
    close(Error(`Connection closed by server`), false, false);
  }
  function onmessage(event: { data: any }): void {
    if (status !== 'open') return;
    events$.next({ event: 'data', data: event.data });
  }

  if (socket) {
    socket.addEventListener('open', onopen);
    socket.addEventListener('error', onerror);
    socket.addEventListener('close', onclose);
    socket.addEventListener('message', onmessage);
  }

  function close(error: Error | null, explicit: boolean, early: boolean): void {
    if (!active) return;

    active = false;
    status = 'close';
    events$.next({ event: 'close', data: error });
    events$.complete();
    if (!early) earlyClose.resolve({ event: 'close', data: error });
    if (socket) {
      try {
        socket.removeEventListener('open', onopen);
        socket.removeEventListener('error', onerror);
        socket.removeEventListener('close', onclose);
        socket.removeEventListener('message', onmessage);
      } catch (err) {}
      if (explicit) {
        try {
          socket.close();
        } catch (err) {}
      }
    }
  }

  const ready: Promise<RPCClientConnectionEvent | void> = Promise.race([
    earlyClose,
    events$
      .pipe(
        filter((x) => x.event === 'open'),
        take(1)
      )
      .toPromise()
  ]);

  return {
    get status() {
      return status;
    },
    actions: {
      send: (data: DataOutput) => {
        return new Promise((resolve, reject) => {
          ready
            .then((x) => {
              if (status === 'open') {
                send(data)
                  .then(resolve)
                  .catch(reject);
              } else {
                if (x && x.event === 'close' && x.data) reject(x.data);
                else reject(Error(`Can't request over a closed socket`));
              }
            })
            .catch((err) => reject(err));
        });
      },
      close: () => {
        earlyClose.resolve({
          event: 'close',
          data: Error(`Connection closed by client`)
        });
        close(null, true, true);
      }
    },
    events$: events$.asObservable()
  };
}
