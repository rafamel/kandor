import { Element } from '../Element';
import {
  InterceptImplementation,
  ServiceExceptionsImplementation,
  InterceptFactoryImplementation
} from '~/types';
import { InterceptInput, InterceptHookInput } from './definitions';
import { Observable, from } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { mergeServiceExceptions } from '~/transform/merge';

export class Intercept<I = any, O = any, C = any> extends Element<
  InterceptImplementation
> {
  public static ensure<I = any, O = any, C = any>(
    intercept: InterceptImplementation<I, O, C>
  ): Intercept<I, O, C> {
    return intercept instanceof Intercept
      ? intercept
      : new Intercept(intercept);
  }
  /**
   * Exposes a simpler api to create intercepts to be run *before* the `resolve` function of a `ServiceImplementation` has been called to act on the incoming `data`.
   */
  public static before<T, C>(
    hook: InterceptHookInput<T, C>
  ): Intercept<T, any, C> {
    return new Intercept({
      kind: 'intercept',
      exceptions: hook.exceptions || [],
      factory(...args: any) {
        const fn = hook.factory.apply(this, args);
        return function(data, context, info, next) {
          const get = async (): Promise<T | void> => fn(data, context, info);
          return from(get()).pipe(
            switchMap((value) => next(value === undefined ? data : value))
          );
        };
      }
    });
  }
  /**
   * Exposes a simpler api to create intercepts to be run *after* the `resolve` function of a `ServiceImplementation` has been called to act on the outgoing `data`.
   */
  public static after<T, C>(
    hook: InterceptHookInput<T, C>
  ): Intercept<any, T, C> {
    return new Intercept({
      kind: 'intercept',
      exceptions: hook.exceptions || [],
      factory(...args: any) {
        const fn = hook.factory.apply(this, args);
        return function(data, context, info, next) {
          const get = async (value: T): Promise<T> => {
            const result = await fn(value, context, info);
            return result === undefined ? value : result;
          };
          return next(data).pipe(mergeMap((value) => get(value)));
        };
      }
    });
  }
  public static allOf(intercepts: InterceptImplementation[]): Intercept {
    function pair(
      a: InterceptImplementation,
      b: InterceptImplementation
    ): InterceptImplementation {
      return {
        kind: 'intercept',
        exceptions: mergeServiceExceptions(a.exceptions, b.exceptions),
        factory(...args: any) {
          const aFn = a.factory.apply(this, args);
          const bFn = b.factory.apply(this, args);
          return function(data, context, info, next) {
            return aFn(data, context, info, (data) => {
              return bFn(data, context, info, next);
            });
          };
        }
      };
    }

    if (!intercepts.length) {
      return new Intercept();
    }
    if (intercepts.length === 1) {
      return new Intercept(intercepts[0]);
    }

    let intercept = pair(intercepts[0], intercepts[1]);
    for (const item of intercepts.slice(2)) {
      intercept = pair(intercept, item);
    }

    return new Intercept(intercept);
  }
  public readonly exceptions: ServiceExceptionsImplementation;
  public readonly factory: InterceptFactoryImplementation<I, O, C>;
  public constructor(intercept?: InterceptInput<I, O, C>) {
    super('intercept');

    if (!intercept) intercept = {};

    const factory =
      intercept.factory || (() => (data, context, info, next) => next(data));
    this.exceptions = intercept.exceptions || [];
    this.factory = (...args: any) => {
      const fn = factory.apply(this, args);
      return function(data, context, info, next) {
        const get = async (): Promise<Observable<O>> => {
          return fn(data, context, info, (input?: I) => {
            return input === undefined ? next(data) : next(input);
          });
        };
        return from(get()).pipe(switchMap((obs) => obs));
      };
    };
  }
  public element(): InterceptImplementation<I, O, C> {
    return {
      kind: this.kind,
      exceptions: this.exceptions,
      factory: this.factory
    };
  }
}
