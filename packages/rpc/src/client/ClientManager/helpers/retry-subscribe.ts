import { filter, take } from 'rxjs/operators';
import { RPCStreamRequest } from '~/types';
import { ConnectionManager } from '../ConnectionManager';
import { ClientStore } from '../ClientStore';
import { Promist } from 'promist';

export const RETRY_DELAY = 5000;

export function retrySubscribe(
  request: RPCStreamRequest,
  connection: ConnectionManager,
  store: ClientStore
): void {
  let success = false;
  let stopped = false;
  let onDelayedSuccessFn: null | (() => void) = null;
  const force = new Promist<void>();

  async function retry(): Promise<void> {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (!stopped && !success) {
      if (connection.status === 'open') {
        try {
          await connection.send(request);
          success = true;
          if (!stopped) store.setRetry(request.id, null);
          if (onDelayedSuccessFn) onDelayedSuccessFn();
        } catch (err) {
          connection.report(err);
        }
      }
      if (!success) {
        const retryWait = Promist.wait(RETRY_DELAY);
        force.then(() => retryWait.resolve());
        await Promise.race([
          retryWait,
          connection.status$
            .pipe(
              filter((x) => x === 'open'),
              take(1)
            )
            .toPromise()
        ]);
      }
    }
  }

  store.setRetry(request.id, {
    promise: retry(),
    stop(onDelayedSuccess?: () => void) {
      if (success || stopped) return;

      stopped = true;
      store.setRetry(request.id, null);
      if (onDelayedSuccess) onDelayedSuccessFn = onDelayedSuccess;
      force.resolve();
    }
  });
}
