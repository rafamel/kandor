import { ErrorCode, Schema } from '../types';

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
  S extends SubscriptionService = SubscriptionService,
  A extends TreeTypes<Q, S> = TreeTypes<Q, S>,
  B extends TreeServices<Q, M, S> = TreeServices<Q, M, S>,
  C extends TreeScopes<Q, M, S> = TreeScopes<Q, M, S>
> {
  kind: 'collection';
  types: A;
  services: B;
  scopes: C;
}

export interface ScopeTree<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService,
  B extends TreeServices<Q, M, S> = TreeServices<Q, M, S>,
  C extends TreeScopes<Q, M, S> = TreeScopes<Q, M, S>
> {
  kind: 'scope';
  services: B;
  scopes: C;
}

export interface TreeTypes<
  Q extends QueryService = QueryService,
  S extends SubscriptionService = SubscriptionService
> {
  [key: string]: Type<Q, S>;
}

export type TreeServices<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = HashServices<Q, M, S> & CrudServices<Q, M, S>;

export interface HashServices<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> {
  [key: string]: Q | M | S;
}

export interface CrudServices<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> {
  get?: Q | S;
  list?: Q | S;
  create?: M;
  update?: M;
  patch?: M;
  remove?: M;
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
  errors: ServiceErrors;
  request: string | RequestType;
  response: string | ResponseType;
}

export interface ServiceErrors {
  [key: string]: ErrorType | string;
}

// Types
export interface ErrorType {
  kind: 'error';
  code: ErrorCode;
  description?: string;
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
