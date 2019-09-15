import { InputHook, AppCollectionTree } from '~/types';
import { collection as createCollection } from './collection';

export function scope(
  name: string,
  collection: AppCollectionTree,
  hooks?: InputHook | InputHook[]
): AppCollectionTree {
  const { types, ...other } = collection;
  const tree = createCollection();
  tree.types = types;
  tree.scopes[name] = other;

  return hooks ? createCollection(tree, hooks) : tree;
}
