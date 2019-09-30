import {
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  InputQueryService,
  InputMutationService,
  InputSubscriptionService,
  Envelope
} from '~/types';
import handleInputTypes from './input-types';

export function query<I, O, N extends string>(
  name: N,
  query: InputQueryService<I, O>
): Envelope<QueryServiceImplementation<I, O>, N> {
  const { names, ...other } = handleInputTypes(name, query.types);
  return {
    name,
    ...other,
    item: {
      kind: 'query',
      types: names,
      resolve: query.resolve
    }
  };
}

export function mutation<I, O, N extends string>(
  name: N,
  mutation: InputMutationService<I, O>
): Envelope<MutationServiceImplementation<I, O>, N> {
  const { names, ...other } = handleInputTypes(name, mutation.types);
  return {
    name,
    ...other,
    item: {
      kind: 'mutation',
      types: names,
      resolve: mutation.resolve
    }
  };
}

export function subscription<I, O, N extends string>(
  name: N,
  subscription: InputSubscriptionService<I, O>
): Envelope<SubscriptionServiceImplementation<I, O>, N> {
  const { names, ...other } = handleInputTypes(name, subscription.types);
  return {
    name,
    ...other,
    item: {
      kind: 'subscription',
      types: names,
      resolve: subscription.resolve
    }
  };
}
