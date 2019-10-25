import { Observable, BehaviorSubject } from 'rxjs';
import { Promist } from 'promist';
import { RPCUnaryRequest, RPCSubscribeRequest } from '@karmic/rpc-adapter';
import { RPCClientStatus } from '../types';

export interface ConnectionManager {
  status: RPCClientStatus;
  errors: Error[];
  actions: ConnectionManagerActions;
  status$: Observable<RPCClientStatus>;
  errors$: Observable<Error>;
}

export interface ConnectionManagerActions {
  report: (error: Error) => void;
  close: () => void;
}

export interface PendingRequests {
  unary: { [key: string]: PendingUnaryRequest };
  stream: { [key: string]: PendingStreamRequest };
  retries: { [key: string]: RetrySubscribe };
  unsubscribe: { [key: string]: NodeJS.Timer };
}

export interface PendingUnaryRequest {
  request: RPCUnaryRequest;
  destination: Promist<any, 'deferrable'>;
}

export interface PendingStreamRequest {
  request: RPCSubscribeRequest;
  destination: BehaviorSubject<any>;
}

export interface RetrySubscribe {
  promise: Promise<void>;
  stop: (onDelayedSuccess?: () => void) => void;
}
