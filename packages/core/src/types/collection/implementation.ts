import {
  Service,
  Element,
  Tree,
  Type,
  CollectionTree,
  ScopeTree,
  ErrorType,
  RequestType,
  ResponseType,
  QueryService,
  MutationService,
  SubscriptionService,
  ResponseTypeChildren,
  TreeTypes,
  TreeServices,
  TreeScopes,
  ServiceTypes,
  HashServices,
  CrudServices,
  ServiceErrors
} from './collection';
import { Observable } from '../observable';
import { Schema } from '../schema';

// Groups
export type ElementImplementation = Element<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TreeImplementation = Tree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TypeImplementation = Type<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ServiceImplementation = Service<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

// Tree
export type CollectionTreeImplementation<
  A extends TreeTypesImplementation = TreeTypesImplementation,
  B extends TreeServicesImplementation = TreeServicesImplementation,
  C extends TreeScopesImplementation = TreeScopesImplementation
> = CollectionTree<
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
> = ScopeTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  B,
  C
>;

export type TreeTypesImplementation = TreeTypes<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TreeServicesImplementation = TreeServices<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type HashServicesImplementation = HashServices<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type CrudServicesImplementation = CrudServices<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type TreeScopesImplementation = TreeScopes<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

// Services
export interface QueryServiceImplementation<I = any, O = any>
  extends QueryService {
  types: ServiceTypesImplementation;
  resolve: (data: I, context: any) => Promise<O>;
  intercepts?: InterceptImplementation[];
}

export interface MutationServiceImplementation<I = any, O = any>
  extends MutationService {
  types: ServiceTypesImplementation;
  resolve: (data: I, context: any) => Promise<O>;
  intercepts?: InterceptImplementation[];
}

export interface SubscriptionServiceImplementation<I = any, O = any>
  extends SubscriptionService {
  types: ServiceTypesImplementation;
  resolve: (data: I, context: any) => Observable<O>;
  intercepts?: InterceptImplementation[];
}

export interface ServiceTypesImplementation extends ServiceTypes {
  errors: ServiceErrorsImplementation;
  request: string | RequestTypeImplementation;
  response: string | ResponseTypeImplementation;
}

export type ServiceErrorsImplementation = ServiceErrors;

export interface InterceptImplementation<I = any, O = any> {
  kind: 'intercept';
  errors: ServiceErrorsImplementation;
  factory: InterceptFactoryImplementation<I, O>;
}

export type InterceptFactoryImplementation<I = any, O = any> = (
  schemas: InterceptSchemasImplementation
) => InterceptResolveImplementation<I, O>;

export type InterceptResolveImplementation<I = any, O = any> = (
  data: I,
  context: any,
  next: (data: I) => Observable<O>
) => Observable<O>;

export interface InterceptSchemasImplementation {
  request: Schema;
  response: Schema;
}

// Types
export type ErrorTypeImplementation = ErrorType;

export type RequestTypeImplementation = RequestType;

export type ResponseTypeImplementation = ResponseType<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ResponseTypeChildrenImplementation = ResponseTypeChildren<
  QueryServiceImplementation,
  SubscriptionServiceImplementation
>;
