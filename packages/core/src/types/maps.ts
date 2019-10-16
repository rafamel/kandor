import {
  CollectionTree,
  ErrorType,
  Service,
  QueryService,
  MutationService,
  SubscriptionService,
  ScopeTree
} from './collection';
import {
  CollectionTreeImplementation,
  ServiceImplementation,
  ScopeTreeImplementation
} from './implementation';
import { GenericError } from './types';

export type ApplicationCollection<T extends CollectionTree> = T & {
  types: { [P in GenericError]: ErrorType };
};

export type NormalCollection<
  T extends CollectionTree
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation
  : CollectionTree;

export interface CollectionRoutes<T extends CollectionTree> {
  [key: string]: T extends CollectionTreeImplementation
    ? ServiceImplementation
    : Service;
}

export type ScopeCollection<
  T extends CollectionTree,
  N extends string
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation<
      T['types'],
      {},
      { [P in N]: ScopeTreeImplementation<T['services'], T['scopes']> }
    >
  : CollectionTree<
      QueryService,
      MutationService,
      SubscriptionService,
      T['types'],
      {},
      {
        [P in N]: ScopeTree<
          QueryService,
          MutationService,
          SubscriptionService,
          T['services'],
          T['scopes']
        >;
      }
    >;

export type ExtractCollection<
  T extends CollectionTree,
  N extends keyof T['scopes']
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation<
      T['types'],
      T['scopes'][N]['services'],
      T['scopes'][N]['scopes']
    >
  : CollectionTree<
      QueryService,
      MutationService,
      SubscriptionService,
      T['types'],
      T['scopes'][N]['services'],
      T['scopes'][N]['scopes']
    >;
