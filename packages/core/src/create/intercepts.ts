import {
  InputInterceptHook,
  InterceptImplementation,
  InputIntercept,
  CollectionTreeImplementation
} from '~/types';
import { from, Observable } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import clone from 'lodash.clonedeep';
import { traverse, isElementService } from '~/utils';

export function intercepts<T extends CollectionTreeImplementation>(
  collection: T,
  intercepts: InterceptImplementation[]
): T {
  collection = clone(collection);

  traverse({ tree: collection, deep: true, children: true }, (element) => {
    if (!isElementService(element)) return;
    element.intercepts = intercepts.concat(element.intercepts);
  });

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
        return from(get()).pipe(switchMap((value) => next(value)));
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
        const get = async (data: T): Promise<T> => fn(data, context);
        return next(data).pipe(mergeMap((value) => get(value)));
      };
    }
  };
}
