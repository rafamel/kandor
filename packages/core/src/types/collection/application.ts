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

// Groups
export type ElementApplication = Element<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication
>;

export type TreeApplication = Tree<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication
>;

export type TypeApplication = Type<
  QueryServiceApplication,
  SubscriptionServiceApplication
>;

export type ServiceApplication = Service<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication
>;

// Tree
export type CollectionTreeApplication<
  A extends TreeTypesApplication = TreeTypesApplication,
  B extends TreeServicesApplication = TreeServicesApplication,
  C extends TreeScopesApplication = TreeScopesApplication
> = CollectionTree<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication,
  A,
  B,
  C
>;

export type ScopeTreeApplication<
  B extends TreeServicesApplication = TreeServicesApplication,
  C extends TreeScopesApplication = TreeScopesApplication
> = ScopeTree<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication,
  B,
  C
>;

export type TreeTypesApplication = TreeTypes<
  QueryServiceApplication,
  SubscriptionServiceApplication
>;

export type TreeServicesApplication = TreeServices<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication
>;

export type HashServicesApplication = HashServices<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication
>;

export type CrudServicesApplication = CrudServices<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication
>;

export type TreeScopesApplication = TreeScopes<
  QueryServiceApplication,
  MutationServiceApplication,
  SubscriptionServiceApplication
>;

// Services
export interface QueryServiceApplication<I = any, O = any>
  extends QueryService {
  types: ServiceTypesApplication;
  resolve: (data: I, context: any) => Promise<O>;
}

export interface MutationServiceApplication<I = any, O = any>
  extends MutationService {
  types: ServiceTypesApplication;
  resolve: (data: I, context: any) => Promise<O>;
}

export interface SubscriptionServiceApplication<I = any, O = any>
  extends SubscriptionService {
  types: ServiceTypesApplication;
  resolve: (data: I, context: any) => Observable<O>;
}

export interface ServiceTypesApplication extends ServiceTypes {
  errors: ServiceErrorsApplication;
  request: string;
  response: string;
}

export interface ServiceErrorsApplication extends ServiceErrors {
  [key: string]: string;
}

// Types
export type ErrorTypeApplication = ErrorType;

export type RequestTypeApplication = RequestType;

export type ResponseTypeApplication = ResponseType<
  QueryServiceApplication,
  SubscriptionServiceApplication
>;

export type ResponseTypeChildrenApplication = ResponseTypeChildren<
  QueryServiceApplication,
  SubscriptionServiceApplication
>;
