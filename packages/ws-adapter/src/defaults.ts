import WebSocket from 'ws';
import { RPCAdapterOptionsOnly } from './types';

export default function createDefaults(): Required<RPCAdapterOptionsOnly> {
  return {
    heartbeat: 60000,
    server: new WebSocket.Server({ noServer: true }),
    context: () => ({})
  };
}
