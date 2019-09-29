import { FreeItem, CollectionTree, ScopeTree } from '~/types';
import { emptyCollection, emptyTypes } from '~/utils';
import group from './group';

export default function scope<N extends string, T extends CollectionTree>(
  name: N,
  collection: FreeItem<T>
): FreeItem<
  CollectionTree &
    Pick<T, 'types'> & {
      scopes: { [P in N]: ScopeTree & Pick<T, 'services' | 'scopes'> };
    }
> {
  const item = group(name, collection);

  return {
    ...item,
    item: {
      ...emptyCollection(),
      types: item.item.types,
      scopes: {
        [name]: {
          ...item.item,
          types: emptyTypes()
        }
      } as any
    }
  };
}
