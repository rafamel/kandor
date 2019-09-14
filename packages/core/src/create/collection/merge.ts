import { CollectionTree, ScopeTree } from '~/types';
import { emptyCollection } from './empty';

export function mergeCollectionArray(
  collections: CollectionTree[]
): CollectionTree {
  return collections.reduce(
    (acc, collection) => mergeCollections(acc, collection),
    emptyCollection()
  );
}

export function mergeCollections(
  a: CollectionTree,
  b: CollectionTree
): CollectionTree {
  const { types: aTypes, ...aScope } = a;
  const { types: bTypes, ...bScope } = b;
  return {
    types: {
      error: { ...aTypes.error, ...bTypes.error },
      request: { ...aTypes.request, ...bTypes.request },
      response: { ...aTypes.response, ...bTypes.response }
    },
    ...mergeScopes(aScope, bScope)
  };
}

export function mergeScopes(a: ScopeTree, b: ScopeTree): ScopeTree {
  const scopeKeys = {
    a: Object.keys(a.scopes),
    b: Object.keys(b.scopes)
  };
  const nonUniqueScopeKeys = scopeKeys.a.filter(
    (x) => scopeKeys.b.indexOf(x) !== -1
  );

  return {
    services: {
      query: { ...a.services.query, ...b.services.query },
      mutation: { ...a.services.mutation, ...b.services.mutation },
      subscription: { ...a.services.subscription, ...b.services.subscription }
    },
    scopes: {
      ...a.scopes,
      ...b.scopes,
      ...nonUniqueScopeKeys.reduce(
        (acc: { [key: string]: ScopeTree }, x) =>
          Object.assign(acc, mergeScopes(a.scopes[x], b.scopes[x])),
        {}
      )
    }
  };
}
