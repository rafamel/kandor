import { RPCUnaryRequest, RPCStreamRequest } from '~/types';
import { Promist } from 'promist';
import { BehaviorSubject } from 'rxjs';

export interface PendingUnaryRequest {
  request: RPCUnaryRequest;
  destination: Promist<any, 'deferrable'>;
}

export interface PendingStreamRequest {
  request: RPCStreamRequest;
  destination: BehaviorSubject<any>;
}

export interface RetrySubscribe {
  promise: Promise<void>;
  stop: (onDelayedSuccess?: () => void) => void;
}
