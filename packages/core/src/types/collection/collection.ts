import { ErrorCode } from '../error';
import { Schema } from '../schema';

// Groups
export type Element<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = Tree<Q, M, S> | Type<Q, S> | Service<Q, M, S>;

export type Tree<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = CollectionTree<Q, M, S> | ScopeTree;

export type Type<
  Q extends QueryService = QueryService,
  S extends SubscriptionService = SubscriptionService
> = ErrorType | RequestType | ResponseType<Q, S>;

export type Service<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = Q | M | S;

// Tree
export interface CollectionTree<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> {
  kind: 'collection';
  types: TreeTypes<Q, S>;
  services: TreeServices<Q, M, S>;
  scopes: TreeScopes<Q, M, S>;
}

export interface ScopeTree<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> {
  kind: 'scope';
  services: { [key: string]: Q | M | S };
  scopes: { [key: string]: ScopeTree<Q, M, S> };
}

export interface TreeTypes<
  Q extends QueryService = QueryService,
  S extends SubscriptionService = SubscriptionService
> {
  [key: string]: Type<Q, S>;
}

export interface TreeServices<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> {
  [key: string]: Q | M | S;
}

export interface TreeScopes<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> {
  [key: string]: ScopeTree<Q, M, S>;
}

// Services
export interface QueryService {
  kind: 'query';
  types: ServiceTypes;
}

export interface MutationService {
  kind: 'mutation';
  types: ServiceTypes;
}

export interface SubscriptionService {
  kind: 'subscription';
  types: ServiceTypes;
}

export interface ServiceTypes {
  errors: string[];
  request: string;
  response: string;
}

// Types
export interface ErrorType {
  kind: 'error';
  code: ErrorCode;
}

export interface RequestType {
  kind: 'request';
  schema: Schema;
}

export interface ResponseType<
  Q extends QueryService = QueryService,
  S extends SubscriptionService = SubscriptionService
> {
  kind: 'response';
  schema: Schema;
  children?: ResponseTypeChildren<Q, S>;
}

export interface ResponseTypeChildren<
  Q extends QueryService = QueryService,
  S extends SubscriptionService = SubscriptionService
> {
  [key: string]: Q | S;
}
