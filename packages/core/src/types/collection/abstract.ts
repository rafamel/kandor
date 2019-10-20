import { ErrorCode, Schema } from '../types';

// Groups
export type AbstractElement<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = AbstractTree<Q, M, S> | AbstractType<Q, S> | AbstractService<Q, M, S>;

export type AbstractTree<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = AbstractCollectionTree<Q, M, S> | AbstractScopeTree<Q, M, S>;

export type AbstractType<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> = AbstractErrorType | AbstractRequestType | AbstractResponseType<Q, S>;

export type AbstractService<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = Q | M | S;

// Tree
export interface AbstractCollectionTree<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService,
  A extends AbstractTreeTypes<Q, S> = AbstractTreeTypes<Q, S>,
  B extends AbstractTreeServices<Q, M, S> = AbstractTreeServices<Q, M, S>,
  C extends AbstractTreeScopes<Q, M, S> = AbstractTreeScopes<Q, M, S>
> {
  kind: 'collection';
  types: A;
  services: B;
  scopes: C;
}

export interface AbstractScopeTree<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService,
  B extends AbstractTreeServices<Q, M, S> = AbstractTreeServices<Q, M, S>,
  C extends AbstractTreeScopes<Q, M, S> = AbstractTreeScopes<Q, M, S>
> {
  kind: 'scope';
  services: B;
  scopes: C;
}

export interface AbstractTreeTypes<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  [key: string]: AbstractType<Q, S>;
}

export type AbstractTreeServices<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = AbstractHashServices<Q, M, S> & AbstractCrudServices<Q, M, S>;

export interface AbstractHashServices<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> {
  [key: string]: Q | M | S;
}

export interface AbstractCrudServices<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> {
  get?: Q | S;
  list?: Q | S;
  create?: M;
  update?: M;
  patch?: M;
  remove?: M;
}

export interface AbstractTreeScopes<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> {
  [key: string]: AbstractScopeTree<Q, M, S>;
}

// Services
export interface AbstractQueryService {
  kind: 'query';
  types: AbstractServiceTypes<
    AbstractQueryService,
    AbstractSubscriptionService
  >;
}

export interface AbstractMutationService {
  kind: 'mutation';
  types: AbstractServiceTypes<
    AbstractQueryService,
    AbstractSubscriptionService
  >;
}

export interface AbstractSubscriptionService {
  kind: 'subscription';
  types: AbstractServiceTypes<
    AbstractQueryService,
    AbstractSubscriptionService
  >;
}

export interface AbstractServiceTypes<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  errors: AbstractServiceErrors;
  request: string | AbstractRequestType;
  response: string | AbstractResponseType<Q, S>;
}

export interface AbstractServiceErrors {
  [key: string]: AbstractErrorType | string;
}

// Types
export interface AbstractErrorType {
  kind: 'error';
  code: ErrorCode;
  description?: string;
}

export interface AbstractRequestType {
  kind: 'request';
  schema: Schema;
}

export interface AbstractResponseType<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  kind: 'response';
  schema: Schema;
  children?: AbstractResponseTypeChildren<Q, S>;
}

export interface AbstractResponseTypeChildren<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  [key: string]: Q | S;
}
