import {
  AppScopeTree,
  CollectionTree,
  ScopeTree,
  TreeTypes,
  TreeServices
} from '~/types';

export function mergeCollection<
  A extends CollectionTree,
  B extends CollectionTree
>(a: A, b: B): A & B {
  const { types: aTypes, ...aScope } = a;
  const { types: bTypes, ...bScope } = b;
  return {
    types: mergeTypes(aTypes, bTypes),
    ...mergeScope(aScope, bScope)
  } as A & B;
}

export function mergeScope<A extends ScopeTree, B extends ScopeTree>(
  a: A,
  b: B
): A & B {
  const scopeKeys = {
    a: Object.keys(a.scopes),
    b: Object.keys(b.scopes)
  };
  const nonUniqueScopeKeys = scopeKeys.a.filter(
    (x) => scopeKeys.b.indexOf(x) !== -1
  );

  return {
    services: mergeServices(a.services, b.services),
    scopes: {
      ...a.scopes,
      ...b.scopes,
      ...nonUniqueScopeKeys.reduce(
        (acc: { [key: string]: AppScopeTree }, x) =>
          Object.assign(acc, mergeScope(a.scopes[x], b.scopes[x])),
        {}
      )
    }
  } as A & B;
}

export function mergeTypes<A extends TreeTypes, B extends TreeTypes>(
  a: A,
  b: B
): A & B {
  return {
    error: { ...a.error, ...b.error },
    request: { ...a.request, ...b.request },
    response: { ...a.response, ...b.response }
  } as A & B;
}

export function mergeServices<A extends TreeServices, B extends TreeServices>(
  a: A,
  b: B
): A & B {
  return {
    query: { ...a.query, ...b.query },
    mutation: { ...a.mutation, ...b.mutation },
    subscription: { ...a.subscription, ...b.subscription }
  } as A & B;
}
