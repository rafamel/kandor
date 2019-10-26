import {
  CollectionTreeImplementation,
  query,
  application,
  services,
  ApplicationServices,
  collections,
  types
} from '@karmic/core';
import { RPCAdapterOptions, RPCAdapter } from './types';
import createDefaults from './defaults';
import ChannelMananger from './ChannelManager';
import { createErrors } from './helpers/create-errors';
import resolve from './resolve';
import createAllow from './helpers/create-allow';
import { lazy } from 'promist';

const codes = {
  TryAgain: 1013,
  UnsupportedPayload: 1007
};

export default function adapter(
  collection: CollectionTreeImplementation,
  options?: RPCAdapterOptions
): RPCAdapter {
  const opts = Object.assign(createDefaults(), options);
  const allow = createAllow(opts);

  const app = application(
    collections(
      collection,
      types({ [opts.routeError.name]: opts.routeError.item })
    ),
    { children: opts.children }
  );
  const dapp = application(
    services({ declaration: query({ resolve: () => app.declaration }) })
  );

  const errors = createErrors(app.declaration, opts.routeError);
  const routes: ApplicationServices = {
    ':declaration': dapp.flatten(':').declaration,
    ...app.flatten(':')
  };

  opts.server.on('connection', function connection(ws, req) {
    const send = (data: object): void => ws.send(JSON.stringify(data));
    const channels = new ChannelMananger(errors, send);
    const promise = lazy.fn(() => (opts.context ? opts.context(req, ws) : {}));

    ws.on('message', function incoming(message): void {
      let json: any;
      try {
        json = JSON.parse(message.toString());
      } catch (err) {
        ws.close(codes.UnsupportedPayload);
        return cleanup();
      }
      if (
        typeof json !== 'object' ||
        json === null ||
        !json.id ||
        typeof json.id !== 'string'
      ) {
        ws.close(codes.UnsupportedPayload);
        return cleanup();
      }

      return resolve(
        json,
        promise,
        channels,
        (route: string) => routes[route],
        allow
      );
    });

    // Check for broken connections, and run cleanup if so
    let interval: null | NodeJS.Timer = null;
    if (opts.heartbeat) {
      let isAlive = true;
      ws.on('pong', () => (isAlive = true));
      interval = setInterval(() => {
        if (isAlive === false) {
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
      channels.destroy();
      if (interval) clearInterval(interval);
    }
  });

  return {
    declaration: app.declaration
  };
}
