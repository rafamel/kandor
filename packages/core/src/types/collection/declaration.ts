import {
  AbstractElement,
  AbstractTree,
  AbstractService,
  AbstractCollectionTree,
  AbstractScopeTree,
  AbstractServicesRecord,
  AbstractServicesHash,
  AbstractServicesCrud,
  AbstractScopesRecord,
  AbstractSchemasRecord,
  AbstractChildrenRecord,
  AbstractExceptionsRecord,
  AbstractServiceExceptions,
  AbstractQueryService,
  AbstractMutationService,
  AbstractSubscriptionService,
  AbstractException,
  AbstractSchema,
  AbstractChildren,
  AbstractChildrenSchemas,
  AbstractChildrenServices
} from './abstract';
import { ExceptionLabel } from '../exceptions';
import { JSONSchema } from '../definitions';

/* Groups */
export type ElementDeclaration = AbstractElement<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type TreeDeclaration = AbstractTree<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ServiceDeclaration = AbstractService<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

/* Tree */
export type CollectionTreeDeclaration<
  A extends ExceptionsRecordDeclaration = ExceptionsRecordDeclaration,
  B extends SchemasRecordDeclaration = SchemasRecordDeclaration,
  C extends ChildrenRecordDeclaration = ChildrenRecordDeclaration,
  D extends ServicesRecordDeclaration = ServicesRecordDeclaration,
  E extends ScopesRecordDeclaration = ScopesRecordDeclaration
> = AbstractCollectionTree<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration,
  A,
  B,
  C,
  D,
  E
>;

export type ScopeTreeDeclaration = AbstractScopeTree<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ServicesRecordDeclaration = AbstractServicesRecord<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ServicesHashDeclaration = AbstractServicesHash<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ServicesCrudDeclaration = AbstractServicesCrud<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ScopesRecordDeclaration = AbstractScopesRecord<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type SchemasRecordDeclaration = AbstractSchemasRecord;

export type ChildrenRecordDeclaration = AbstractChildrenRecord<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ExceptionsRecordDeclaration = AbstractExceptionsRecord;

/* Services */
export type ServiceExceptionsDeclaration = AbstractServiceExceptions;

export interface QueryServiceDeclaration extends AbstractQueryService {
  resolve?: never;
  intercepts?: never;
}

export interface MutationServiceDeclaration extends AbstractMutationService {
  resolve?: never;
  intercepts?: never;
}

export interface SubscriptionServiceDeclaration
  extends AbstractSubscriptionService {
  resolve?: never;
  intercepts?: never;
}

/* Exception */
export type ExceptionDeclaration<
  L extends ExceptionLabel = ExceptionLabel
> = AbstractException<L>;

/* Schema */
export type SchemaDeclaration<
  S extends JSONSchema = JSONSchema
> = AbstractSchema<S>;

/* Children */
export type ChildrenDeclaration<
  A extends ChildrenServicesDeclaration = ChildrenServicesDeclaration
> = AbstractChildren<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration,
  A
>;

export type ChildrenSchemasDeclaration = AbstractChildrenSchemas;

export type ChildrenServicesDeclaration = AbstractChildrenServices<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;
