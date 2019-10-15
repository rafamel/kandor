import { CollectionTreeImplementation, CollectionTree } from './collection';

export type NormalCollection<
  T extends CollectionTree
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation
  : CollectionTree;
