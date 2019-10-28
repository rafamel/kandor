import { deferred } from 'promist';

export interface ResolvableWait {
  promise: Promise<void>;
  resolve: () => void;
}

export function resolvableWait(ms: number): ResolvableWait {
  const promise = deferred<void>();
  let timer: null | NodeJS.Timer = setTimeout(resolve, ms);

  function resolve(): void {
    if (!timer) return;

    clearTimeout(timer);
    timer = null;
    promise.resolve();
  }

  return {
    promise: promise.then((x) => x),
    resolve: resolve
  };
}
