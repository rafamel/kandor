import { CollectionTree, ScopeCollection, ExtractCollection } from '~/types';
import { emptyCollection, emptyScope } from '~/utils';

/**
 * Given a `collection`, returs a new collection with all of the services within the input collection in scope `name`.
 */
export function scope<T extends CollectionTree, N extends string>(
  name: N,
  collection: T
): ScopeCollection<T, N> {
  const { types, ...other } = collection;

  return {
    ...emptyCollection(),
    types,
    scopes: {
      [name]: { ...emptyScope(), ...other }
    }
  } as any;
}

/**
 * Given a collection with a scope `name`, returns a new collection with all of the services in the root scope of the input collection discarded, and scope `name` serving as the new collection root.
 */
export function extract<T extends CollectionTree, N extends keyof T['scopes']>(
  collection: T,
  name: N & string
): ExtractCollection<T, N> {
  const { types } = collection;
  const { services, scopes } = collection.scopes[name];
  return {
    ...emptyCollection(),
    types,
    services,
    scopes
  } as any;
}
