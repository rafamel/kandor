import { Type, CollectionTree, Service } from '../collection';

export type CollectionPopulate<
  T extends CollectionTree | Type | Service,
  N extends string
> = T extends CollectionTree
  ? T
  : T extends Type
  ? { types: { [P in N]: T } }
  : { services: { [P in N]: T } };

export type CollectionScopePopulate<
  T extends CollectionTree,
  N extends string
> = Pick<T, 'types'> & { scopes: { [P in N]: Omit<T, 'types' | 'kind'> } };
