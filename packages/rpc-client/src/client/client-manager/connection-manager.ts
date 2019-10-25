import { RPCClientStatus } from '../types';
import { BehaviorSubject, Subject } from 'rxjs';
import { Connection } from '../connect';
import { ConnectionManager } from './types';
import WebSocket from 'isomorphic-ws';

export function createConnectionManager(
  connection: Connection,
  onMessage: (data: WebSocket.Data) => void
): ConnectionManager {
  let active = true;
  const status$ = new BehaviorSubject<RPCClientStatus>(connection.status);
  const errors$ = new Subject<Error>();

  const nextStatus = (status: RPCClientStatus): void => {
    if (status$.value !== status) status$.next(status);
  };

  let errors: Error[] = [];
  const nextError = (error: Error): void => {
    errors = errors.concat(error);
    errors$.next(error);
  };

  const subscription = connection.events$.subscribe({
    next(value) {
      if (!active) return;
      switch (value.event) {
        case 'pending': {
          return nextStatus('pending');
        }
        case 'open': {
          return nextStatus('open');
        }
        case 'close': {
          if (value.data) nextError(value.data);
          if (status$.value !== 'pending') nextStatus('close');
          return;
        }
        case 'message': {
          try {
            return onMessage(value.data);
          } catch (err) {
            return nextError(err);
          }
        }
        default: {
          nextError(Error(`Unexpected event: ${JSON.stringify(value)}`));
        }
      }
    },
    error(err) {
      if (!active) return;
      nextError(err);
      close();
    },
    complete() {
      if (!active) return;
      close();
    }
  });

  function close(): void {
    if (!active) return;
    active = false;

    connection.actions.close();
    setTimeout(() => subscription.unsubscribe(), 0);

    nextStatus('close');
    nextStatus('complete');
    status$.complete();
    errors$.complete();
  }

  return {
    get status() {
      return active ? connection.status : 'complete';
    },
    get errors() {
      return errors;
    },
    actions: {
      report(error: Error) {
        if (!active) return;
        nextError(error);
      },
      close() {
        if (!active) return;
        close();
      }
    },
    status$: status$.asObservable(),
    errors$: errors$.asObservable()
  };
}
