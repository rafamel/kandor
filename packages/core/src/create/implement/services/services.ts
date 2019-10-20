import {
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  TreeServicesImplementation,
  CollectionTreeImplementation,
  ServiceTypesImplementation
} from '~/types';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  UnaryServiceImplementationInput,
  StreamServiceImplementationInput,
  ServiceInputTypes
} from './types';
import { isElement } from '~/inspect';
import { request, response } from '../types';

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
  query: UnaryServiceImplementationInput<I, O, C>
): QueryServiceImplementation<I, O, C> {
  return {
    ...query,
    kind: 'query',
    types: parseTypes(query.types),
    intercepts: query.intercepts || [],
    async resolve(...args: any) {
      return query.resolve.apply(this, args);
    }
  };
}

/**
 * Creates a `MutationServiceImplementation`.
 */
export function mutation<I = any, O = any, C = any>(
  mutation: UnaryServiceImplementationInput<I, O, C>
): MutationServiceImplementation<I, O, C> {
  return {
    ...mutation,
    kind: 'mutation',
    types: parseTypes(mutation.types),
    intercepts: mutation.intercepts || [],
    async resolve(...args: any) {
      return mutation.resolve.apply(this, args);
    }
  };
}

/**
 * Creates a `SubscriptionServiceImplementation`.
 */
export function subscription<I = any, O = any, C = any>(
  subscription: StreamServiceImplementationInput<I, O, C>
): SubscriptionServiceImplementation<I, O, C> {
  return {
    ...subscription,
    kind: 'subscription',
    types: parseTypes(subscription.types),
    intercepts: subscription.intercepts || [],
    resolve(...args: any) {
      const get = async (): Promise<Observable<any>> => {
        return subscription.resolve.apply(this, args);
      };
      return from(get()).pipe(switchMap((obs) => obs));
    }
  };
}

function parseTypes(types: ServiceInputTypes = {}): ServiceTypesImplementation {
  return {
    errors: types.errors || {},
    request:
      isElement(types.request) || typeof types.request === 'string'
        ? types.request
        : request({ schema: types.request || {} }),
    response:
      isElement(types.response) || typeof types.response === 'string'
        ? types.response
        : response({ schema: types.response || {} })
  };
}
