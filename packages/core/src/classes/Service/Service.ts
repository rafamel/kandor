import {
  ServiceUnion,
  ServiceResolveImplementation,
  InterceptImplementation,
  ServiceExceptionsUnion,
  AbstractSchema,
  ServiceKind,
  ServiceImplementation
} from '~/types';
import { Element } from '../Element';
import {
  ServiceInput,
  ServiceElement,
  ServiceQueryInput,
  ServiceMutationInput,
  ServiceSubscriptionInput,
  ServiceInterceptOptions
} from './definitions';
import { Schema } from '../Schema';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { isServiceImplementation } from '~/inspect';

export class Service<
  K extends ServiceKind = ServiceKind,
  T = void,
  I = any,
  O = any,
  C = any
> extends Element<ServiceUnion> {
  public static ensure<
    K extends ServiceKind = ServiceKind,
    T = void,
    I = any,
    O = any,
    C = any
  >(service: ServiceInput<K, T, I, O, C>): Service<K, T, I, O, C> {
    return service instanceof Service ? service : new Service(service as any);
  }
  public static query<T = void, I = any, O = any, C = any>(
    query?: ServiceQueryInput<T, I, O, C>
  ): Service<'query', T, I, O, C> {
    return new Service({ kind: 'query', ...query });
  }
  public static mutation<T = void, I = any, O = any, C = any>(
    mutation?: ServiceMutationInput<T, I, O, C>
  ): Service<'mutation', T, I, O, C> {
    return new Service({ kind: 'mutation', ...mutation });
  }
  public static subscription<T = void, I = any, O = any, C = any>(
    subscription?: ServiceSubscriptionInput<T, I, O, C>
  ): Service<'subscription', T, I, O, C> {
    return new Service({ kind: 'subscription', ...subscription });
  }
  public readonly kind: K;
  public readonly request: string | AbstractSchema;
  public readonly response: string | AbstractSchema;
  public readonly exceptions: ServiceExceptionsUnion;
  public readonly resolve: ServiceElement<K, T, I, O, C>['resolve'];
  public readonly intercepts: ServiceElement<K, T, I, O, C>['intercepts'];
  public constructor(service: ServiceInput<K, T, I, O, C>) {
    super(service.kind);
    this.request = service.request || new Schema(null, { type: 'object' });
    this.response = service.response || new Schema(null, { type: 'null' });
    this.exceptions = service.exceptions || [];

    if (service.resolve) {
      const fn = service.resolve;
      let resolve: ServiceResolveImplementation;
      const intercepts = (service.intercepts ||
        []) as InterceptImplementation[];

      if (service.kind === 'subscription') {
        resolve = function resolve(this: any, ...args: any) {
          const get = async (): Promise<Observable<any>> => {
            return (fn as any).apply(this, args);
          };
          return from(get()).pipe(switchMap((obs) => obs));
        };
      } else {
        resolve = async function resolve(this: any, ...args: any) {
          return (fn as any).apply(this, args);
        };
      }

      this.resolve = resolve as ServiceElement<K, T, I, O, C>['resolve'];
      this.intercepts = intercepts as ServiceElement<
        K,
        T,
        I,
        O,
        C
      >['intercepts'];
    }
  }
  public intercept(
    this: ServiceImplementation,
    intercepts: InterceptImplementation | InterceptImplementation[],
    options?: ServiceInterceptOptions
  ): Service<K, T, I, O, C> {
    if (!isServiceImplementation(this)) {
      throw Error(`Intercepts can only be applied to service implementations`);
    }
    const opts = Object.assign({ prepend: true }, options);
    const arr =
      intercepts && !Array.isArray(intercepts) ? [intercepts] : intercepts;

    return new Service({
      ...(this as any),
      intercepts: opts.prepend
        ? arr.concat(this.intercepts || [])
        : (this.intercepts || []).concat(arr)
    });
  }
  public element(): ServiceElement<K, T, I, O, C> {
    return (this.resolve
      ? {
          kind: this.kind,
          exceptions: this.exceptions,
          request: this.request,
          response: this.response,
          resolve: this.resolve,
          intercepts: this.intercepts
        }
      : {
          kind: this.kind,
          exceptions: this.exceptions,
          request: this.request,
          response: this.response
        }) as ServiceElement<K, T, I, O, C>;
  }
}
