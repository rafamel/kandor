import { ErrorLabel, Schema, ElementItem } from '../types';
import {
  CollectionTreeKind,
  ScopeTreeKind,
  QueryServiceKind,
  MutationServiceKind,
  SubscriptionServiceKind,
  ErrorTypeKind,
  RequestTypeKind,
  ResponseTypeKind,
  ServiceElementKind
} from './kind';

// Groups
export type AbstractElement<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> =
  | AbstractTreeElement<Q, M, S>
  | AbstractTypeElement<Q, S>
  | AbstractServiceElement<Q, M, S>;

export type AbstractTreeElement<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = AbstractCollectionTree<Q, M, S> | AbstractScopeTree<Q, M, S>;

export type AbstractTypeElement<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> = AbstractErrorType | AbstractRequestType | AbstractResponseType<Q, S>;

export type AbstractServiceElement<
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
  kind: CollectionTreeKind;
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
  kind: ScopeTreeKind;
  services: B;
  scopes: C;
}

export type AbstractTreeHash<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> =
  | AbstractTreeTypes<Q, S>
  | AbstractTreeServices<Q, M, S>
  | AbstractTreeScopes<Q, M, S>;

export interface AbstractTreeTypes<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  [key: string]: AbstractTypeElement<Q, S>;
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
export interface AbstractGenericService {
  kind: ServiceElementKind;
  errors: AbstractServiceErrors;
  request: string | Schema;
  response: string | Schema;
  // TODO
  // nullable: boolean;
}

export type AbstractServiceErrors = Array<
  string | ElementItem<AbstractErrorType>
>;

export interface AbstractQueryService extends AbstractGenericService {
  kind: QueryServiceKind;
}

export interface AbstractMutationService extends AbstractGenericService {
  kind: MutationServiceKind;
}

export interface AbstractSubscriptionService extends AbstractGenericService {
  kind: SubscriptionServiceKind;
}

// Types
export interface AbstractErrorType<L extends ErrorLabel = ErrorLabel> {
  kind: ErrorTypeKind;
  schema?: never;
  children?: never;
  label: L;
  description?: string;
}

export interface AbstractRequestType {
  kind: RequestTypeKind;
  schema: Schema;
  children?: never;
  label?: never;
  description?: never;
}

export interface AbstractResponseType<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  kind: ResponseTypeKind;
  schema: Schema;
  children?: AbstractResponseTypeChildren<Q, S>;
  label?: never;
  description?: never;
}

export interface AbstractResponseTypeChildren<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  [key: string]: Q | S;
}
