import { JSONSchema, ElementItem } from '../definitions';
import {
  CollectionTreeKind,
  ScopeTreeKind,
  ServiceKind,
  QueryServiceKind,
  MutationServiceKind,
  SubscriptionServiceKind,
  ExceptionKind,
  SchemaKind,
  ChildrenKind
} from '../kind';
import { ExceptionLabel } from '../exceptions';

/* Groups */
export type AbstractElement<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> =
  | AbstractTree<Q, M, S>
  | AbstractService<Q, M, S>
  | AbstractException
  | AbstractSchema
  | AbstractChildren<Q, S>;

export type AbstractTree<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = AbstractCollectionTree<Q, M, S> | AbstractScopeTree<Q, M, S>;

export type AbstractService<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = Q | M | S;

/* Tree */
export interface AbstractCollectionTree<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService,
  A extends AbstractExceptionsRecord = AbstractExceptionsRecord,
  B extends AbstractSchemasRecord = AbstractSchemasRecord,
  C extends AbstractChildrenRecord<Q, S> = AbstractChildrenRecord<Q, S>,
  D extends AbstractServicesRecord<Q, M, S> = AbstractServicesRecord<Q, M, S>,
  E extends AbstractScopesRecord<Q, M, S> = AbstractScopesRecord<Q, M, S>
> {
  kind: CollectionTreeKind;
  exceptions: A;
  schemas: B;
  children: C;
  services: D;
  scopes: E;
}

export interface AbstractScopeTree<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService,
  A extends AbstractServicesRecord<Q, M, S> = AbstractServicesRecord<Q, M, S>,
  B extends AbstractScopesRecord<Q, M, S> = AbstractScopesRecord<Q, M, S>
> {
  kind: ScopeTreeKind;
  services: A;
  scopes: B;
}

export type AbstractServicesRecord<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> = AbstractServicesHash<Q, M, S> & AbstractServicesCrud<Q, M, S>;

export interface AbstractServicesHash<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> {
  [key: string]: Q | M | S;
}

export interface AbstractServicesCrud<
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

export interface AbstractScopesRecord<
  Q extends AbstractQueryService,
  M extends AbstractMutationService,
  S extends AbstractSubscriptionService
> {
  [key: string]: AbstractScopeTree<Q, M, S>;
}

export interface AbstractSchemasRecord {
  [key: string]: AbstractSchema;
}

export interface AbstractChildrenRecord<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  [key: string]: AbstractChildren<Q, S>;
}

export interface AbstractExceptionsRecord {
  [key: string]: AbstractException;
}

/* Services */
export type AbstractServiceExceptions = Array<
  string | ElementItem<AbstractException>
>;

export interface AbstractGenericService {
  kind: ServiceKind;
  request: string | AbstractSchema;
  response: string | AbstractSchema;
  exceptions: AbstractServiceExceptions;
  // TODO
  // nullable: boolean;
}

export interface AbstractQueryService extends AbstractGenericService {
  kind: QueryServiceKind;
}

export interface AbstractMutationService extends AbstractGenericService {
  kind: MutationServiceKind;
}

export interface AbstractSubscriptionService extends AbstractGenericService {
  kind: SubscriptionServiceKind;
}

/* Exception */
export interface AbstractException<L extends ExceptionLabel = ExceptionLabel> {
  kind: ExceptionKind;
  label: L;
  description?: string;
}

/* Schema */
export interface AbstractSchema<S extends JSONSchema = JSONSchema> {
  kind: SchemaKind;
  schema: S;
}

/* Children */
export interface AbstractChildren<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService,
  A extends AbstractChildrenServices<Q, S> = AbstractChildrenServices<Q, S>
> {
  kind: ChildrenKind;
  schemas: AbstractChildrenSchemas;
  services: A;
}

export type AbstractChildrenSchemas = Array<
  string | ElementItem<AbstractSchema>
>;

export interface AbstractChildrenServices<
  Q extends AbstractQueryService,
  S extends AbstractSubscriptionService
> {
  [key: string]: Q | S;
}
