import { CollectionTreeImplementation } from '@karmic/core';
import { RPCServer, DataOutput, DataInput } from '@karmic/rpc';
import { RPCAdapterOptions, WSAdapter } from './types';
import createDefaults from './defaults';
import { Subject } from 'rxjs';

const codes = {
  TryAgain: 1013,
  UnsupportedPayload: 1007
};

export function rpc(
  collection: CollectionTreeImplementation,
  options?: RPCAdapterOptions
): WSAdapter {
  const opts = Object.assign(createDefaults(), options);
  const rpc = new RPCServer(collection, opts);

  opts.server.on('connection', (ws, req) => {
    let didClose = false;
    const subject = new Subject<DataInput>();
    const disconnect = rpc.connect({
      context: () => opts.context(req, ws),
      actions: {
        send: (data: DataOutput) => {
          return new Promise((resolve, reject) => {
            return ws.send(data, (err) => (err ? reject(err) : resolve()));
          });
        },
        report: () => {
          ws.close(codes.TryAgain);
          cleanup();
        },
        close: () => {
          ws.close();
          cleanup();
        }
      },
      data$: subject.asObservable()
    });

    // Request on message
    ws.on('message', (message): void => subject.next(message));

    // Check for broken connections, and run cleanup if so
    let interval: null | NodeJS.Timer = null;
    if (opts.heartbeat) {
      let isAlive = true;
      ws.on('pong', () => (isAlive = true));
      interval = setInterval(() => {
        if (!isAlive) {
          ws.close(codes.TryAgain);
          return cleanup();
        }
        isAlive = false;
        ws.ping();
      }, opts.heartbeat);
    }

    // Cleanup on close
    ws.on('close', cleanup);

    function cleanup(): void {
      if (didClose) return;

      didClose = true;
      subject.complete();
      disconnect();
      if (interval) clearInterval(interval);
    }
  });

  return {
    declaration: rpc.declaration,
    terminate(): void {
      rpc.terminate();
      opts.server.close();
    }
  };
}
