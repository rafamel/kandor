import { CollectionTreeImplementation, ScopeTreeImplementation } from '~/types';
import { emptyCollection, emptyScope } from '~/utils';

export function scope<T extends CollectionTreeImplementation, N extends string>(
  name: N,
  collection: T
): CollectionTreeImplementation<
  T['types'],
  {},
  { [P in N]: ScopeTreeImplementation<T['services'], T['scopes']> }
> {
  const { types, ...other } = collection;

  return {
    ...emptyCollection(),
    types,
    scopes: {
      [name]: { ...emptyScope(), ...other }
    } as any
  };
}

export function extract<
  T extends CollectionTreeImplementation,
  N extends keyof T['scopes']
>(
  collection: T,
  name: N & string
): CollectionTreeImplementation<
  T['types'],
  T['scopes'][N]['services'],
  T['scopes'][N]['scopes']
> {
  const { types } = collection;
  const { services, scopes } = collection.scopes[name];
  return {
    ...emptyCollection(),
    types,
    services,
    scopes
  };
}
