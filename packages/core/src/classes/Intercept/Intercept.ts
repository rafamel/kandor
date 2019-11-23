import { InterceptImplementation } from '~/types';
import { Element } from '../Element';
import { InterceptCreateInput, InterceptHookInput } from './definitions';
import { Observable, from } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { mergeServiceExceptions } from '~/transform/merge';

export class Intercept<
  T extends InterceptImplementation = InterceptImplementation
> extends Element<T> {
  /**
   * Creates an intercept.
   */
  public static create<I = any, O = any>(
    intercept?: InterceptCreateInput<I, O>
  ): Intercept<InterceptImplementation<I, O>> {
    if (!intercept) intercept = {};
    const factory =
      intercept.factory || (() => (data, context, info, next) => next(data));

    return new Intercept({
      kind: 'intercept',
      exceptions: intercept.exceptions || [],
      factory(...args: any) {
        const fn = factory.apply(this, args);
        return function(data, context, info, next) {
          const get = async (): Promise<Observable<O>> => {
            return fn(data, context, info, (input?: I) => {
              return input === undefined ? next(data) : next(input);
            });
          };
          return from(get()).pipe(switchMap((obs) => obs));
        };
      }
    });
  }
  /**
   * Exposes a simpler api to create intercepts to be run *before* the `resolve` function of a `ServiceImplementation` has been called to act on the incoming `data`.
   */
  public static before<T>(
    hook: InterceptHookInput<T>
  ): Intercept<InterceptImplementation<T, any>> {
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
  public static after<T>(
    hook: InterceptHookInput<T>
  ): Intercept<InterceptImplementation<any, T>> {
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
  public static allOf(
    intercepts: InterceptImplementation[]
  ): Intercept<InterceptImplementation> {
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
      return Intercept.create();
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
  public readonly exceptions: T['exceptions'];
  public readonly factory: T['factory'];
  public constructor(intercept: T) {
    super(intercept.kind);
    this.exceptions = intercept.exceptions;
    this.factory = intercept.factory;
  }
  public element(): T {
    return {
      kind: this.kind,
      exceptions: this.exceptions,
      factory: this.factory
    } as T;
  }
}
