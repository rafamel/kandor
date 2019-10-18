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
  ScopeTreeImplementation,
  QueryServiceImplementation,
  MutationServiceImplementation
} from './implementation';
import { GenericError } from './types';

export type GenericCollection<
  T extends CollectionTree
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation
  : CollectionTree;

export type UnaryCollection<
  T extends CollectionTree
> = T extends CollectionTreeImplementation
  ? CollectionTree<
      QueryServiceImplementation,
      MutationServiceImplementation,
      never
    >
  : CollectionTree<QueryService, MutationService, never>;

export type ApplicationCollection<
  T extends CollectionTree = CollectionTree
> = T & {
  types: { [P in GenericError]: ErrorType };
};

export type GenericService<
  T extends CollectionTree
> = T extends CollectionTreeImplementation ? ServiceImplementation : Service;

export interface ServicesTree<T extends CollectionTree = CollectionTree> {
  [key: string]: GenericService<T> | ServicesTree<T>;
}

export interface ServicesRoutes<T extends CollectionTree = CollectionTree>
  extends ServicesTree<T> {
  [key: string]: GenericService<T>;
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
