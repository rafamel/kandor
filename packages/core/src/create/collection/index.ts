import { InputHook, AppCollectionTree } from '~/types';
import { mergeCollectionArray } from './merge';
import { emptyCollection } from './empty';
import { setCollectionHooks } from './hooks';

export function collection(
  collections?: AppCollectionTree | AppCollectionTree[],
  hooks?: InputHook | InputHook[]
): AppCollectionTree {
  const collection = Array.isArray(collections)
    ? mergeCollectionArray(collections)
    : collections || emptyCollection();

  return hooks ? setCollectionHooks(collection, hooks) : collection;
}
