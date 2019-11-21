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
  AbstractServiceErrors,
  AbstractTreeHash
} from './abstract';
import { ErrorLabel } from '../types';

// Groups
export type ElementDeclaration = AbstractElement<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type TreeElementDeclaration = AbstractTreeElement<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type TypeElementDeclaration = AbstractTypeElement<
  QueryServiceDeclaration,
  SubscriptionServiceDeclaration
>;

export type ServiceElementDeclaration = AbstractServiceElement<
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

export type TreeHashDeclaration = AbstractTreeHash<
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration
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
