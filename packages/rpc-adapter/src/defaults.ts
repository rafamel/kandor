import WebSocket from 'ws';
import { error } from '@karmic/core';
import { RPCAdapterOptions } from './types';

export default function createDefaults(): Required<RPCAdapterOptions> {
  return {
    children: true,
    querySubscriptions: true,
    heartbeat: 60000,
    server: new WebSocket.Server({ noServer: true }),
    context: () => ({}),
    routeError: {
      name: 'RouteError',
      type: error({ code: 'ClientNotFound' })
    }
  };
}
