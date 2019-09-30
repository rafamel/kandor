import {
  CollectionTreeImplementation,
  EnvelopeCollection,
  CollectionScopePopulate
} from '~/types';
import { emptyCollection } from '~/utils';
import group from './group';

export default function scope<
  T extends CollectionTreeImplementation,
  N extends string
>(
  name: N,
  collection: EnvelopeCollection<T>
): EnvelopeCollection<
  CollectionTreeImplementation & CollectionScopePopulate<T, N>
> {
  const envelope = group(name, collection);
  const empty = emptyCollection() as CollectionTreeImplementation;
  const { types, ...other } = envelope.item;

  return {
    ...envelope,
    item: {
      ...empty,
      types,
      scopes: {
        [name]: { ...other, kind: 'scope' }
      } as any
    }
  };
}
