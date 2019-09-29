import {
  QueryService,
  MutationService,
  SubscriptionService,
  ServiceImplementation
} from './services';
import {
  ErrorType,
  ResponseType,
  RequestType,
  CollectionTree,
  Type,
  TreeTypes
} from './collection';

export type FreeKind =
  | CollectionTree
  | QueryService
  | MutationService
  | SubscriptionService
  | ErrorType
  | ResponseType
  | RequestType;

export interface FreeItem<
  T extends FreeKind = FreeKind,
  N extends string = string
> {
  name: T extends CollectionTree ? null : N;
  kind: FreeItemKind<T>;
  item: T;
  types?: FreeItemTypes;
}

export interface FreeCollection<T extends CollectionTree>
  extends FreeItem<CollectionTree> {
  name: null;
  kind: 'collection';
  item: T;
}

export interface FreeItemTypes extends TreeTypes {
  inline?: TreeTypes;
}

export type FreeItemKind<K extends FreeKind> = K extends CollectionTree
  ? 'collection'
  : (K extends ServiceImplementation
      ? ('query' | 'mutation' | 'subscription')
      : (K extends MutationService
          ? 'mutation'
          : (K extends ErrorType
              ? 'error'
              : (K extends ResponseType
                  ? 'response'
                  : (K extends RequestType ? 'request' : never)))));

export type PartialPopulatedTree<
  K extends FreeKind,
  N extends string
> = K extends CollectionTree
  ? K
  : K extends Type
  ? { types: { [P in FreeItemKind<K>]: { [Q in N]: K } } }
  : { services: { [P in FreeItemKind<K>]: { [Q in N]: K } } };
