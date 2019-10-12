import {
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  InputQueryService,
  InputMutationService,
  InputSubscriptionService,
  TreeServicesImplementation,
  CollectionTreeImplementation,
  Observable,
  InputServiceTypes,
  ServiceTypesImplementation
} from '~/types';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { request, response } from './types';
import { isElement } from '~/utils';

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
    types: parseTypes(query.types),
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
    types: parseTypes(mutation.types),
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
    types: parseTypes(subscription.types),
    intercepts: subscription.intercepts || [],
    resolve(...args: any) {
      const get = async (): Promise<Observable<O>> => {
        return subscription.resolve.apply(this, args);
      };
      return from(get()).pipe(switchMap((obs) => obs));
    }
  };
}

function parseTypes(types: InputServiceTypes = {}): ServiceTypesImplementation {
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
