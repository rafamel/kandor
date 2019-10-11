import { CollectionTreeImplementation, ScopeTreeImplementation } from '~/types';
import { emptyCollection, emptyScope } from '~/utils';

export default function scope<
  T extends CollectionTreeImplementation,
  N extends string
>(
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
