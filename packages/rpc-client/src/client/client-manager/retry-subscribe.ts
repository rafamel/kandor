import { RPCSubscribeRequest } from '@karmic/rpc-adapter';
import { ConnectionManager, PendingRequests } from './types';
import { Connection } from '../connect';
import { deferred } from 'promist';
import { resolvableWait } from '../helpers';
import { filter, take } from 'rxjs/operators';

export const RETRY_DELAY = 5000;

export function retrySubscribe(
  request: RPCSubscribeRequest,
  connection: Connection,
  manager: ConnectionManager,
  pending: PendingRequests
): void {
  let success = false;
  let stopped = false;
  let onDelayedSuccessFn: null | (() => void) = null;
  const force = deferred<void>();

  async function retry(): Promise<void> {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!stopped && !success) {
      if (connection.status === 'open') {
        try {
          await connection.actions.send(JSON.stringify(request));
          success = true;
          if (!stopped) delete pending.retries[request.id];
          if (onDelayedSuccessFn) onDelayedSuccessFn();
        } catch (err) {
          manager.actions.report(err);
        }
      }
      if (!success) {
        const retryWait = resolvableWait(RETRY_DELAY);
        force.then(() => retryWait.resolve());
        await Promise.race([
          retryWait.promise,
          connection.events$
            .pipe(
              filter((x) => x.event === 'open'),
              take(1)
            )
            .toPromise()
        ]);
      }
    }
  }

  pending.retries[request.id] = {
    promise: retry(),
    stop(onDelayedSuccess?: () => void) {
      if (success || stopped) return;

      stopped = true;
      delete pending.retries[request.id];
      if (onDelayedSuccess) onDelayedSuccessFn = onDelayedSuccess;
      force.resolve();
    }
  };
}
