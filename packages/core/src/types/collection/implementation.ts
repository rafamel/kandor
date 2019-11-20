import {
  AbstractElement,
  AbstractTreeElement,
  AbstractTypeElement,
  AbstractServiceElement,
  AbstractCollectionTree,
  AbstractScopeTree,
  AbstractTreeTypes,
  AbstractTreeServices,
  AbstractHashServices,
  AbstractCrudServices,
  AbstractTreeScopes,
  AbstractQueryService,
  AbstractMutationService,
  AbstractSubscriptionService,
  AbstractResponseType,
  AbstractResponseTypeChildren,
  AbstractRequestType,
  AbstractErrorType,
  AbstractServiceErrors
} from './abstract';
import { Observable } from 'rxjs';
import { Schema, ElementInfo, ServiceInfo, ErrorLabel } from '../types';

// Groups
export type ElementImplementation = AbstractElement<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TreeElementImplementation = AbstractTreeElement<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TypeElementImplementation = AbstractTypeElement<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ServiceElementImplementation<
  I = any,
  O = any,
  C = any
> = AbstractServiceElement<
  QueryServiceImplementation<I, O, C>,
  MutationServiceImplementation<I, O, C>,
  SubscriptionServiceImplementation<I, O, C>
>;

// Tree
export type CollectionTreeImplementation<
  A extends TreeTypesImplementation = TreeTypesImplementation,
  B extends TreeServicesImplementation = TreeServicesImplementation,
  C extends TreeScopesImplementation = TreeScopesImplementation
> = AbstractCollectionTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  A,
  B,
  C
>;

export type ScopeTreeImplementation<
  B extends TreeServicesImplementation = TreeServicesImplementation,
  C extends TreeScopesImplementation = TreeScopesImplementation
> = AbstractScopeTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  B,
  C
>;

export type TreeTypesImplementation = AbstractTreeTypes<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TreeServicesImplementation = AbstractTreeServices<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type HashServicesImplementation = AbstractHashServices<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type CrudServicesImplementation = AbstractCrudServices<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TreeScopesImplementation = AbstractTreeScopes<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

// Services
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
  info: ElementInfo
) => Promise<O>;

export type StreamServiceResolveImplementation<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: ElementInfo
) => Observable<O>;

export type ServiceErrorsImplementation = AbstractServiceErrors;

// Intercept
export interface InterceptImplementation<I = any, O = any, C = any> {
  kind: 'intercept';
  errors: ServiceErrorsImplementation;
  factory: InterceptFactoryImplementation<I, O, C>;
}

export type InterceptFactoryImplementation<I = any, O = any, C = any> = (
  schemas: InterceptSchemasImplementation
) => InterceptResolveImplementation<I, O, C>;

export type InterceptResolveImplementation<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: ServiceInfo,
  next: (data: I) => Observable<O>
) => Observable<O>;

export interface InterceptSchemasImplementation {
  request: Schema;
  response: Schema;
}

// Types
export type ErrorTypeImplementation<
  L extends ErrorLabel = ErrorLabel
> = AbstractErrorType<L>;

export type RequestTypeImplementation = AbstractRequestType;

export type ResponseTypeImplementation = AbstractResponseType<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ResponseTypeChildrenImplementation = AbstractResponseTypeChildren<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;
