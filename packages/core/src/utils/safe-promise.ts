import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { safeTrigger } from './safe-trigger';

/**
 * Converts an *Observable* into a *Promise* that will throw if the observable
 * completes before it emits a value.
 */
export function toSafePromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const subscription = observable.pipe(take(1)).subscribe({
      next(value) {
        resolve(value);
        safeTrigger(
          () => Boolean(subscription),
          () => subscription.unsubscribe()
        );
      },
      error(err) {
        reject(err);
        safeTrigger(
          () => Boolean(subscription),
          () => subscription.unsubscribe()
        );
      },
      complete() {
        reject(Error(`Source completed before emitting a result`));
        safeTrigger(
          () => Boolean(subscription),
          () => subscription.unsubscribe()
        );
      }
    });
  });
}
