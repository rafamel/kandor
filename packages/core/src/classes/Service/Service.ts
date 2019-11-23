import {
  ServiceUnion,
  ServiceKind,
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  ServiceImplementation,
  InterceptImplementation
} from '~/types';
import {
  ServiceCreateInput,
  ServiceCreate,
  ServiceQueryInput,
  ServiceMutationInput,
  ServiceSubscriptionInput,
  ServiceInterceptOptions
} from './definitions';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Element } from '../Element';
import { isServiceImplementation } from '~/inspect/is';

export class Service<T extends ServiceUnion = ServiceUnion> extends Element<T> {
  static create<K extends ServiceKind, T extends ServiceCreateInput = {}>(
    kind: K,
    service?: T
  ): Service<ServiceCreate<K, T>> {
    if (!service) service = {} as T;

    return new Service({
      kind,
      exceptions: service.exceptions || [],
      request: service.request || { type: 'object' },
      response: service.response || { type: 'null' },
      resolve: service.resolve,
      intercepts: service.resolve ? service.intercepts : undefined
    } as any);
  }
  static query<I = any, O = any, C = any>(
    query: ServiceQueryInput<I, O, C>
  ): Service<QueryServiceImplementation<I, O, C>> {
    return new Service({
      ...Service.create('query', query),
      async resolve(...args: any) {
        return query.resolve.apply(this, args);
      },
      intercepts: query.intercepts
    });
  }
  static mutation<I = any, O = any, C = any>(
    mutation: ServiceMutationInput<I, O, C>
  ): Service<MutationServiceImplementation<I, O, C>> {
    return new Service({
      ...Service.create('mutation', mutation),
      async resolve(...args: any) {
        return mutation.resolve.apply(this, args);
      },
      intercepts: mutation.intercepts
    });
  }
  static subscription<I = any, O = any, C = any>(
    subscription: ServiceSubscriptionInput<I, O, C>
  ): Service<SubscriptionServiceImplementation<I, O, C>> {
    return new Service({
      ...Service.create('subscription', subscription),
      resolve(...args: any) {
        const get = async (): Promise<Observable<any>> => {
          return subscription.resolve.apply(this, args);
        };
        return from(get()).pipe(switchMap((obs) => obs));
      },
      intercepts: subscription.intercepts
    });
  }
  public readonly exceptions: T['exceptions'];
  public readonly request: T['request'];
  public readonly response: T['response'];
  public readonly resolve: T['resolve'];
  public readonly intercepts: T['intercepts'];
  public constructor(service: T) {
    super(service.kind);
    this.exceptions = service.exceptions;
    this.request = service.request;
    this.response = service.response;
    this.resolve = service.resolve;
    this.intercepts = service.intercepts;
  }
  public intercept(
    this: Service<ServiceImplementation>,
    intercepts: InterceptImplementation | InterceptImplementation[],
    options?: ServiceInterceptOptions
  ): Service<T> {
    if (!isServiceImplementation(this as ServiceImplementation)) {
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
  public element(): T {
    return this.resolve
      ? ({
          kind: this.kind,
          exceptions: this.exceptions,
          request: this.request,
          response: this.response,
          resolve: this.resolve,
          intercepts: this.intercepts
        } as T)
      : ({
          kind: this.kind,
          exceptions: this.exceptions,
          request: this.request,
          response: this.response
        } as T);
  }
}
