import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Converts an *Observable* into a *Promise* that will throw if the observable
 * completes before it emits a value.
 */
export function toSafePromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const subscription = observable.pipe(take(1)).subscribe({
      next(value) {
        resolve(value);
        setTimeout(() => subscription.unsubscribe, 0);
      },
      error(err) {
        reject(err);
        setTimeout(() => subscription.unsubscribe, 0);
      },
      complete() {
        reject(Error(`Source completed before emitting a result`));
        setTimeout(() => subscription.unsubscribe, 0);
      }
    });
  });
}
