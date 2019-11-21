import {
  ScopeTreeUnion,
  CollectionTreeUnion,
  InterceptImplementation
} from '~/types';

export function emptyCollection(): CollectionTreeUnion {
  return {
    ...emptyScope(),
    types: {},
    kind: 'collection'
  };
}

export function emptyScope(): ScopeTreeUnion {
  return {
    services: {},
    scopes: {},
    kind: 'scope'
  };
}

export function emptyIntercept(): InterceptImplementation {
  return {
    kind: 'intercept',
    errors: [],
    factory: () => (data, context, info, next) => next(data)
  };
}
