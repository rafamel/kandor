import { CollectionTreeImplementation } from '@karmic/core';
import { RPCServer, DataOutput } from '@karmic/rpc';
import { RPCAdapterOptions, RPCAdapter } from './types';
import createDefaults from './defaults';

const codes = {
  TryAgain: 1013,
  UnsupportedPayload: 1007
};

export function adapter(
  collection: CollectionTreeImplementation,
  options?: RPCAdapterOptions
): RPCAdapter {
  const opts = Object.assign(createDefaults(), options);
  const server = new RPCServer(collection, opts);

  opts.server.on('connection', function connection(ws, req) {
    let didClose = false;
    const connection = server.connect(
      {
        send: (data: DataOutput) => {
          return new Promise((resolve, reject) => {
            return ws.send(data, (err) => (err ? reject(err) : resolve()));
          });
        },
        fatal: () => {
          ws.close(codes.TryAgain);
          cleanup();
        }
      },
      () => opts.context(req, ws)
    );

    // Request on message
    ws.on('message', (message): void => connection.request(message));

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
      setTimeout(() => connection.close(), 0);
      if (interval) clearInterval(interval);
    }
  });

  return {
    declaration: server.declaration
  };
}
