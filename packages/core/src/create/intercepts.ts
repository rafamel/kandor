import {
  InputInterceptHook,
  InterceptImplementation,
  InputIntercept,
  CollectionTreeImplementation
} from '~/types';
import { from, Observable } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import clone from 'lodash.clonedeep';
import {
  traverse,
  isElementService,
  emptyIntercept,
  mergeServiceErrors
} from '~/utils';

export function intercepts<T extends CollectionTreeImplementation>(
  collection: T,
  intercepts: InterceptImplementation[],
  options?: { prepend?: boolean }
): T {
  collection = clone(collection);
  const opts = Object.assign({ prepend: true }, options);

  traverse(
    collection,
    { deep: true, children: true, inline: true },
    (element) => {
      if (!isElementService(element)) return;
      element.intercepts = opts.prepend
        ? intercepts.concat(element.intercepts || [])
        : (element.intercepts || []).concat(intercepts);
    }
  );

  return collection;
}

export function intercept<I, O>(
  intercept: InputIntercept<I, O>
): InterceptImplementation<I, O> {
  return {
    kind: 'intercept',
    errors: intercept.errors || {},
    factory(...args: any) {
      const fn = intercept.factory.apply(this, args);
      return function(data, context, next) {
        const get = async (): Promise<Observable<O>> => {
          return fn(data, context, (input?: I) => {
            return input === undefined ? next(data) : next(input);
          });
        };
        return from(get()).pipe(switchMap((obs) => obs));
      };
    }
  };
}

export function before<T>(
  hook: InputInterceptHook<T>
): InterceptImplementation<T, any> {
  return {
    kind: 'intercept',
    errors: hook.errors || {},
    factory(...args: any) {
      const fn = hook.factory.apply(this, args);
      return function(data, context, next) {
        const get = async (): Promise<T> => fn(data, context);
        return from(get()).pipe(
          switchMap((value) => next(value === undefined ? data : value))
        );
      };
    }
  };
}

export function after<T>(
  hook: InputInterceptHook<T>
): InterceptImplementation<any, T> {
  return {
    kind: 'intercept',
    errors: hook.errors || {},
    factory(...args: any) {
      const fn = hook.factory.apply(this, args);
      return function(data, context, next) {
        const get = async (value: T): Promise<T> => {
          const result = await fn(value, context);
          return result === undefined ? value : result;
        };
        return next(data).pipe(mergeMap((value) => get(value)));
      };
    }
  };
}

export function allof(
  intercepts: InterceptImplementation[]
): InterceptImplementation {
  function pair(
    a: InterceptImplementation,
    b: InterceptImplementation
  ): InterceptImplementation {
    return {
      kind: 'intercept',
      errors: mergeServiceErrors(a.errors, b.errors),
      factory(...args: any) {
        const aFn = a.factory.apply(this, args);
        const bFn = b.factory.apply(this, args);
        return function(data, context, next) {
          return aFn(data, context, (data) => {
            return bFn(data, context, next);
          });
        };
      }
    };
  }

  if (!intercepts.length) return emptyIntercept();
  if (intercepts.length === 1) return intercepts[0];

  let intercept = pair(intercepts[0], intercepts[1]);
  for (const item of intercepts.slice(2)) {
    intercept = pair(intercept, item);
  }

  return intercept;
}
