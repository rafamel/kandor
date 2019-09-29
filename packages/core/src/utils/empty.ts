import { CollectionTree, TreeTypes, TreeServices, ScopeTree } from '~/types';

export function emptyCollection(): CollectionTree {
  return {
    types: emptyTypes(),
    ...emptyScope()
  };
}

export function emptyScope(): ScopeTree {
  return {
    services: emptyServices(),
    scopes: {}
  };
}

export function emptyTypes(): TreeTypes {
  return {
    error: {},
    request: {},
    response: {}
  };
}

export function emptyServices(): TreeServices {
  return {
    query: {},
    mutation: {},
    subscription: {}
  };
}
