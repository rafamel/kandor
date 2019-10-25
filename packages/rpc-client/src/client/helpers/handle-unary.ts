import { RPCUnaryRequest } from '@karmic/rpc-adapter';
import { ClientManager } from '../client-manager';
import { resolvableWait } from './resolvable-wait';

export function handleUnaryRequest(
  request: RPCUnaryRequest,
  manager: ClientManager,
  responseTimeout: number
): Promise<any> {
  const promise = manager.unary(request);
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
