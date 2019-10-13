import { ScopeCreate, CollectionTree, ExtractScopeCreate } from '~/types';
import { emptyCollection, emptyScope } from '~/utils';

export function scope<T extends CollectionTree, N extends string>(
  name: N,
  collection: T
): ScopeCreate<T, N> {
  const { types, ...other } = collection;

  return {
    ...emptyCollection(),
    types,
    scopes: {
      [name]: { ...emptyScope(), ...other }
    }
  } as any;
}

export function extract<T extends CollectionTree, N extends keyof T['scopes']>(
  collection: T,
  name: N & string
): ExtractScopeCreate<T, N> {
  const { types } = collection;
  const { services, scopes } = collection.scopes[name];
  return {
    ...emptyCollection(),
    types,
    services,
    scopes
  } as any;
}
