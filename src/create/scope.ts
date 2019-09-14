import { CollectionTree, InputHook } from '~/types';
import { collection as createCollection } from './collection';

export function scope(
  name: string,
  collection: CollectionTree,
  hooks?: InputHook | InputHook[]
): CollectionTree {
  const { types, ...other } = collection;
  const tree = createCollection();
  tree.types = types;
  tree.scopes[name] = other;

  return hooks ? createCollection(tree, hooks) : tree;
}
