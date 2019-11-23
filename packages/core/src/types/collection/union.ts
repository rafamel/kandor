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
  AbstractException,
  AbstractSchema,
  AbstractChildren,
  AbstractChildrenSchemas,
  AbstractChildrenServices
} from './abstract';
import {
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
} from './declaration';
import {
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
} from './implementation';
import { ExceptionLabel } from '../exceptions';
import { JSONSchema } from '../definitions';

/* Groups */
export type ElementUnion = AbstractElement<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type TreeUnion = AbstractTree<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type ServiceUnion = AbstractService<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

/* Tree */
export type CollectionTreeUnion<
  A extends ExceptionsRecordUnion = ExceptionsRecordUnion,
  B extends SchemasRecordUnion = SchemasRecordUnion,
  C extends ChildrenRecordUnion = ChildrenRecordUnion,
  D extends ServicesRecordUnion = ServicesRecordUnion,
  E extends ScopesRecordUnion = ScopesRecordUnion
> = AbstractCollectionTree<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  A,
  B,
  C,
  D,
  E
>;

export type ScopeTreeUnion<
  A extends ServicesRecordUnion = ServicesRecordUnion,
  B extends ScopesRecordUnion = ScopesRecordUnion
> = AbstractScopeTree<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  A,
  B
>;

export type ServicesRecordUnion = AbstractServicesRecord<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type ServicesHashUnion = AbstractServicesHash<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type ServicesCrudUnion = AbstractServicesCrud<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type ScopesRecordUnion = AbstractScopesRecord<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type SchemasRecordUnion = AbstractSchemasRecord;

export type ChildrenRecordUnion = AbstractChildrenRecord<
  QueryServiceUnion,
  SubscriptionServiceUnion
>;

export type ExceptionsRecordUnion = AbstractExceptionsRecord;

/* Services */
export type ServiceExceptionsUnion = AbstractServiceExceptions;

export type QueryServiceUnion =
  | QueryServiceDeclaration
  | QueryServiceImplementation;

export type MutationServiceUnion =
  | MutationServiceDeclaration
  | MutationServiceImplementation;

export type SubscriptionServiceUnion =
  | SubscriptionServiceDeclaration
  | SubscriptionServiceImplementation;

/* Exception */
export type ExceptionUnion<
  L extends ExceptionLabel = ExceptionLabel
> = AbstractException<L>;

/* Schema */
export type SchemaUnion<S extends JSONSchema = JSONSchema> = AbstractSchema<S>;

/* Children */
export type ChildrenUnion<
  A extends ChildrenServicesUnion = ChildrenServicesUnion
> = AbstractChildren<QueryServiceUnion, SubscriptionServiceUnion, A>;

export type ChildrenSchemasUnion = AbstractChildrenSchemas;

export type ChildrenServicesUnion = AbstractChildrenServices<
  QueryServiceUnion,
  SubscriptionServiceUnion
>;
