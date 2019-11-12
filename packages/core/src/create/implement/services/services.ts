import {
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  TreeServicesImplementation,
  CollectionTreeImplementation,
  ServiceImplementation
} from '~/types';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  QueryServiceImplementationInput,
  MutationServiceImplementationInput,
  SubscriptionServiceImplementationInput
} from './types';

/**
 * Returns a new `collection` with services `services`.
 */
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

/**
 * Creates a `QueryServiceImplementation`.
 */
export function query<I = any, O = any, C = any>(
  query: QueryServiceImplementationInput<I, O, C>
): QueryServiceImplementation<I, O, C> {
  return {
    ...getDefaults(),
    ...query,
    kind: 'query',
    async resolve(...args: any) {
      return query.resolve.apply(this, args);
    }
  };
}

/**
 * Creates a `MutationServiceImplementation`.
 */
export function mutation<I = any, O = any, C = any>(
  mutation: MutationServiceImplementationInput<I, O, C>
): MutationServiceImplementation<I, O, C> {
  const resolve = mutation.resolve || ((() => null) as any);
  return {
    ...getDefaults(),
    ...mutation,
    kind: 'mutation',
    async resolve(...args: any) {
      return resolve.apply(this, args);
    }
  };
}

/**
 * Creates a `SubscriptionServiceImplementation`.
 */
export function subscription<I = any, O = any, C = any>(
  subscription: SubscriptionServiceImplementationInput<I, O, C>
): SubscriptionServiceImplementation<I, O, C> {
  return {
    ...getDefaults(),
    ...subscription,
    kind: 'subscription',
    resolve(...args: any) {
      const get = async (): Promise<Observable<any>> => {
        return subscription.resolve.apply(this, args);
      };
      return from(get()).pipe(switchMap((obs) => obs));
    }
  };
}

function getDefaults(): Omit<ServiceImplementation, 'kind' | 'resolve'> {
  return {
    errors: [],
    request: { type: 'object' },
    response: { type: 'null' },
    intercepts: []
  };
}
