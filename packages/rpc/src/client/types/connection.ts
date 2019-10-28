import { Observable } from 'rxjs';
import { DataInput, DataOutput } from '~/types';

export interface RPCClientConnection {
  status: RPCClientConnectionStatus;
  actions: RPCClientConnectionActions;
  /**
   * Must only emit *data* while its status is `'open'` and after the *open* event is emitted.
   * Must *complete* if the connection will not be recovered.
   */
  events$: Observable<RPCClientConnectionEvent>;
}

export interface RPCClientConnectionActions {
  send: (data: DataOutput) => void | Promise<void>;
  close: () => void;
}

export type RPCClientConnectionStatus = 'open' | 'close';

export type RPCClientConnectionEvent =
  | { event: 'open' }
  | { event: 'close'; data: Error | null }
  | { event: 'data'; data: DataInput };
