import { ScopeTree, CollectionTree } from '~/types';

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
