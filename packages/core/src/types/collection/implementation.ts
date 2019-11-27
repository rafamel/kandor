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
import { ElementInfo, ServiceInfo, JSONSchema } from '../definitions';
import { Observable } from 'rxjs';
import { ExceptionLabel } from '../exceptions';

/* Groups */
export type ElementImplementation = AbstractElement<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TreeImplementation = AbstractTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ServiceImplementation<I = any, O = any, C = any> = AbstractService<
  QueryServiceImplementation<I, O, C>,
  MutationServiceImplementation<I, O, C>,
  SubscriptionServiceImplementation<I, O, C>
>;

/* Tree */
export type CollectionTreeImplementation<
  A extends ExceptionsRecordImplementation = ExceptionsRecordImplementation,
  B extends SchemasRecordImplementation = SchemasRecordImplementation,
  C extends ChildrenRecordImplementation = ChildrenRecordImplementation,
  D extends ServicesRecordImplementation = ServicesRecordImplementation,
  E extends ScopesRecordImplementation = ScopesRecordImplementation
> = AbstractCollectionTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  A,
  B,
  C,
  D,
  E
>;

export type ScopeTreeImplementation = AbstractScopeTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ServicesRecordImplementation = AbstractServicesRecord<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ServicesHashImplementation = AbstractServicesHash<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ServicesCrudImplementation = AbstractServicesCrud<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ScopesRecordImplementation = AbstractScopesRecord<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type SchemasRecordImplementation = AbstractSchemasRecord;

export type ChildrenRecordImplementation = AbstractChildrenRecord<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ExceptionsRecordImplementation = AbstractExceptionsRecord;

/* Services */
export type ServiceExceptionsImplementation = AbstractServiceExceptions;

export interface QueryServiceImplementation<I = any, O = any, C = any>
  extends AbstractQueryService {
  resolve: UnaryServiceResolveImplementation<I, O, C>;
  intercepts?: InterceptImplementation[];
}

export interface MutationServiceImplementation<I = any, O = any, C = any>
  extends AbstractMutationService {
  resolve: UnaryServiceResolveImplementation<I, O, C>;
  intercepts?: InterceptImplementation[];
}

export interface SubscriptionServiceImplementation<I = any, O = any, C = any>
  extends AbstractSubscriptionService {
  resolve: StreamServiceResolveImplementation<I, O, C>;
  intercepts?: InterceptImplementation[];
}

export type ServiceResolveImplementation<I = any, O = any, C = any> =
  | UnaryServiceResolveImplementation<I, O, C>
  | StreamServiceResolveImplementation<I, O, C>;

export type UnaryServiceResolveImplementation<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: Required<ElementInfo>
) => Promise<O>;

export type StreamServiceResolveImplementation<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: Required<ElementInfo>
) => Observable<O>;

/* Intercept */
export interface InterceptImplementation<I = any, O = any, C = any> {
  kind: 'intercept';
  exceptions: ServiceExceptionsImplementation;
  factory: InterceptFactoryImplementation<I, O, C>;
}

export type InterceptFactoryImplementation<I = any, O = any, C = any> = (
  schemas: InterceptSchemasImplementation
) => InterceptResolveImplementation<I, O, C>;

export type InterceptResolveImplementation<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: Required<ServiceInfo>,
  next: (data: I) => Observable<O>
) => Observable<O>;

export interface InterceptSchemasImplementation {
  request: JSONSchema;
  response: JSONSchema;
}

/* Exception */
export type ExceptionImplementation<
  L extends ExceptionLabel = ExceptionLabel
> = AbstractException<L>;

/* Schema */
export type SchemaImplementation = AbstractSchema;

/* Children */
export type ChildrenImplementation<
  A extends ChildrenServicesImplementation = ChildrenServicesImplementation
> = AbstractChildren<
  QueryServiceImplementation,
  SubscriptionServiceImplementation,
  A
>;

export type ChildrenSchemasImplementation = AbstractChildrenSchemas;

export type ChildrenServicesImplementation = AbstractChildrenServices<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;
