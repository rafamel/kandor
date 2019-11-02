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

export function connectEach(
  address: string,
  wsco: WebSocket.ClientOptions,
  timeout?: number
): RPCClientConnection {
  let active = true;
  let status: RPCClientConnectionStatus = 'close';
  const events$ = new Subject<RPCClientConnectionEvent>();

  const socket = new WebSocket(address, wsco);
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

  socket.on('open', () => {
    if (!active) return;
    status = 'open';
    events$.next({ event: 'open' });
  });
  socket.on('error', (err) => {
    close(err, true, false);
  });
  socket.on('close', () => {
    close(Error(`Connection closed by server`), false, false);
  });
  socket.on('message', (message) => {
    if (status !== 'open') return;
    events$.next({ event: 'data', data: message });
  });

  function close(error: Error | null, explicit: boolean, early: boolean): void {
    if (!active) return;

    active = false;
    status = 'close';
    events$.next({ event: 'close', data: error });
    events$.complete();
    if (!early) earlyClose.resolve({ event: 'close', data: error });
    try {
      socket.removeAllListeners();
      if (explicit) socket.close();
    } catch (err) {}
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
                socket.send(data, (err) => (err ? reject(err) : resolve()));
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
