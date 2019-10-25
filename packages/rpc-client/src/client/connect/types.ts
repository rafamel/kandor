import { Observable } from 'rxjs';
import WebSocket from 'isomorphic-ws';
import { RPCClientStatus } from '../types';

export interface Connection {
  status: ConnectionStatus;
  actions: ConnectionActions;
  events$: Observable<ConnectionEvent>;
}

export type ConnectionStatus = RPCClientStatus;

export interface ConnectionActions {
  send: (data: string) => Promise<void>;
  close: () => void;
}

export type ConnectionEvent =
  | { event: 'pending' }
  | { event: 'open' }
  | { event: 'close'; data: Error | null }
  | { event: 'message'; data: WebSocket.Data };
