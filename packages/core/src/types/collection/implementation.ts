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
  TreeScopes
} from './collection';
import { Observable } from '../observable';

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
export type CollectionTreeImplementation = CollectionTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

export type ScopeTreeImplementation = ScopeTree<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
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

export type TreeScopesImplementation = TreeScopes<
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
>;

// Services
export interface QueryServiceImplementation<I = any, O = any>
  extends QueryService {
  resolve: QueryImplementationResolve<I, O>;
}

export interface MutationServiceImplementation<I = any, O = any>
  extends MutationService {
  resolve: MutationImplementationResolve<I, O>;
}

export interface SubscriptionServiceImplementation<I = any, O = any>
  extends SubscriptionService {
  resolve: SubscriptionImplementationResolve<I, O>;
}

export type QueryImplementationResolve<I = any, O = any> = (
  data: I,
  context: any
) => O | Promise<O>;

export type MutationImplementationResolve<I = any, O = any> = (
  data: I,
  context: any
) => O | Promise<O>;

export type SubscriptionImplementationResolve<I = any, O = any> = (
  data: I,
  context: any
) => Observable<O | Promise<O>> | Promise<Observable<O | Promise<O>>>;

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
