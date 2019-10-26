import {
  AbstractElement,
  AbstractTree,
  AbstractType,
  AbstractService,
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
  AbstractServiceTypes,
  AbstractResponseType,
  AbstractResponseTypeChildren,
  AbstractRequestType,
  AbstractErrorType,
  AbstractServiceErrors
} from './abstract';
import { ErrorLabel } from '../types';

// Groups
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

export type TypeDeclaration = AbstractType<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ServiceDeclaration = AbstractService<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

// Tree
export type CollectionTreeDeclaration<
  A extends TreeTypesDeclaration = TreeTypesDeclaration,
  B extends TreeServicesDeclaration = TreeServicesDeclaration,
  C extends TreeScopesDeclaration = TreeScopesDeclaration
> = AbstractCollectionTree<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration,
  A,
  B,
  C
>;

export type ScopeTreeDeclaration<
  B extends TreeServicesDeclaration = TreeServicesDeclaration,
  C extends TreeScopesDeclaration = TreeScopesDeclaration
> = AbstractScopeTree<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration,
  B,
  C
>;

export type TreeTypesDeclaration = AbstractTreeTypes<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type TreeServicesDeclaration = AbstractTreeServices<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type HashServicesDeclaration = AbstractHashServices<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type CrudServicesDeclaration = AbstractCrudServices<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type TreeScopesDeclaration = AbstractTreeScopes<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

// Services
export interface QueryServiceDeclaration extends AbstractQueryService {
  types: ServiceTypesDeclaration;
  resolve?: never;
  intercepts?: never;
}

export interface MutationServiceDeclaration extends AbstractMutationService {
  types: ServiceTypesDeclaration;
  resolve?: never;
  intercepts?: never;
}

export interface SubscriptionServiceDeclaration
  extends AbstractSubscriptionService {
  types: ServiceTypesDeclaration;
  resolve?: never;
  intercepts?: never;
}

export type ServiceTypesDeclaration = AbstractServiceTypes<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ServiceErrorsDeclaration = AbstractServiceErrors;

// Types
export type ErrorTypeDeclaration<
  L extends ErrorLabel = ErrorLabel
> = AbstractErrorType<L>;

export type RequestTypeDeclaration = AbstractRequestType;

export type ResponseTypeDeclaration = AbstractResponseType<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ResponseTypeChildrenDeclaration = AbstractResponseTypeChildren<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;
