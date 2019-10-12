import { ScopeTree, CollectionTree, InterceptImplementation } from '~/types';

export function emptyCollection(): CollectionTree {
  return {
    ...emptyScope(),
    types: {},
    kind: 'collection'
  };
}

export function emptyScope(): ScopeTree {
  return {
    services: {},
    scopes: {},
    kind: 'scope'
  };
}

export function emptyIntercept(): InterceptImplementation {
  return {
    kind: 'intercept',
    errors: {},
    factory: () => (data, context, next) => {
      return next(data);
    }
  };
}
