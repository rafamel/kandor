import { CollectionTree, InputHook } from '~/types';
import { mergeCollectionArray } from './merge';
import { emptyCollection } from './empty';
import { setCollectionHooks } from './hooks';

export function collection(
  collections?: CollectionTree | CollectionTree[],
  hooks?: InputHook | InputHook[]
): CollectionTree {
  const collection = Array.isArray(collections)
    ? mergeCollectionArray(collections)
    : collections || emptyCollection();

  return hooks ? setCollectionHooks(collection, hooks) : collection;
}
