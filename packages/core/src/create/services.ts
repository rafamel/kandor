import {
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  InputQueryService,
  InputMutationService,
  InputSubscriptionService,
  TreeServicesImplementation,
  CollectionTreeImplementation,
  Observable
} from '~/types';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function services<T extends TreeServicesImplementation>(
  services: T
): CollectionTreeImplementation<{}, T, {}> {
  return {
    kind: 'collection',
    types: {},
    scopes: {},
    services: {
      ...services
    }
  };
}

export function query<I, O>(
  query: InputQueryService<I, O>
): QueryServiceImplementation<I, O> {
  return {
    ...query,
    kind: 'query',
    types: {
      errors: {},
      request: { kind: 'request', schema: {} },
      response: { kind: 'response', schema: {} },
      ...(query.types || {})
    },
    intercepts: query.intercepts || [],
    async resolve(...args: any) {
      return query.resolve.apply(this, args);
    }
  };
}

export function mutation<I, O>(
  mutation: InputMutationService<I, O>
): MutationServiceImplementation<I, O> {
  return {
    ...mutation,
    kind: 'mutation',
    types: {
      errors: {},
      request: { kind: 'request', schema: {} },
      response: { kind: 'response', schema: {} },
      ...(mutation.types || {})
    },
    intercepts: mutation.intercepts || [],
    async resolve(...args: any) {
      return mutation.resolve.apply(this, args);
    }
  };
}

export function subscription<I, O>(
  subscription: InputSubscriptionService<I, O>
): SubscriptionServiceImplementation<I, O> {
  return {
    ...subscription,
    kind: 'subscription',
    types: {
      errors: {},
      request: { kind: 'request', schema: {} },
      response: { kind: 'response', schema: {} },
      ...(subscription.types || {})
    },
    intercepts: subscription.intercepts || [],
    resolve(...args: any) {
      const get = async (): Promise<Observable<O>> => {
        return subscription.resolve.apply(this, args);
      };
      return from(get()).pipe(switchMap((obs) => obs));
    }
  };
}
