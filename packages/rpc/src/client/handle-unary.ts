import { resolvableWait } from '@karmic/core';
import { ClientManager } from './ClientManager';

export function handleUnaryRequest(
  method: string,
  params: object | null,
  nextId: () => string | number,
  manager: ClientManager,
  responseTimeout: number
): Promise<any> {
  const promise = manager.unary(nextId(), method, params);
  if (!responseTimeout) return promise;

  const timeoutWait = resolvableWait(responseTimeout);
  return Promise.race([
    timeoutWait.promise.then(() =>
      Promise.reject(Error(`Request reached timeout: ${responseTimeout}ms`))
    ),
    promise
  ])
    .then((value) => {
      timeoutWait.resolve();
      return value;
    })
    .catch((err) => {
      timeoutWait.resolve();
      return Promise.reject(err);
    });
}
