import { ClientManager } from './ClientManager';
import { Promist } from 'promist';

export function handleUnaryRequest(
  method: string,
  params: object | null,
  nextId: () => string | number,
  manager: ClientManager,
  responseTimeout: number
): Promise<any> {
  const promise = manager.unary(nextId(), method, params);
  if (!responseTimeout) return promise;

  const promist = Promist.from(promise);
  promist.timeout(
    responseTimeout,
    Error(`Request reached timeout: ${responseTimeout}ms`)
  );
  return Promise.resolve(promist);
}
