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
  QueryServiceInput,
  MutationServiceInput,
  SubscriptionServiceInput,
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
export function query<I, O>(
  query: QueryServiceInput<I, O>
): QueryServiceImplementation<I, O> {
  return {
    ...query,
    kind: 'query',
    types: parseTypes(query.types),
    async resolve(...args: any) {
      return query.resolve.apply(this, args);
    }
  };
}

/**
 * Creates a `MutationServiceImplementation`.
 */
export function mutation<I, O>(
  mutation: MutationServiceInput<I, O>
): MutationServiceImplementation<I, O> {
  return {
    ...mutation,
    kind: 'mutation',
    types: parseTypes(mutation.types),
    async resolve(...args: any) {
      return mutation.resolve.apply(this, args);
    }
  };
}

/**
 * Creates a `MutationServiceImplementation`.
 */
export function subscription<I, O>(
  subscription: SubscriptionServiceInput<I, O>
): SubscriptionServiceImplementation<I, O> {
  return {
    ...subscription,
    kind: 'subscription',
    types: parseTypes(subscription.types),
    resolve(...args: any) {
      const get = async (): Promise<Observable<O>> => {
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
