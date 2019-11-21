import {
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  ServiceErrorsImplementation,
  ErrorTypeImplementation,
  RequestTypeImplementation
} from './implementation';
import {
  SubscriptionServiceDeclaration,
  MutationServiceDeclaration,
  QueryServiceDeclaration,
  ServiceErrorsDeclaration,
  ErrorTypeDeclaration,
  RequestTypeDeclaration
} from './declaration';
import {
  AbstractTreeElement,
  AbstractCollectionTree,
  AbstractElement,
  AbstractTypeElement,
  AbstractServiceElement,
  AbstractScopeTree,
  AbstractTreeTypes,
  AbstractTreeServices,
  AbstractHashServices,
  AbstractCrudServices,
  AbstractTreeScopes,
  AbstractResponseTypeChildren,
  AbstractResponseType
} from './abstract';
import { ErrorLabel } from '../types';

// Groups
export type ElementUnion = AbstractElement<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type TreeElementUnion = AbstractTreeElement<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type TypeElementUnion = AbstractTypeElement<
  QueryServiceUnion,
  SubscriptionServiceUnion
>;

export type ServiceElementUnion = AbstractServiceElement<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type CollectionTreeUnion = AbstractCollectionTree<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type ScopeTreeUnion = AbstractScopeTree<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type TreeTypesUnion = AbstractTreeTypes<
  QueryServiceUnion,
  SubscriptionServiceUnion
>;

export type TreeServicesUnion = AbstractTreeServices<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type HashServicesUnion = AbstractHashServices<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type CrudServicesUnion = AbstractCrudServices<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

export type TreeScopesUnion = AbstractTreeScopes<
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
>;

// Services
export type QueryServiceUnion =
  | QueryServiceDeclaration
  | QueryServiceImplementation;

export type MutationServiceUnion =
  | MutationServiceDeclaration
  | MutationServiceImplementation;

export type SubscriptionServiceUnion =
  | SubscriptionServiceDeclaration
  | SubscriptionServiceImplementation;

export type ServiceErrorsUnion =
  | ServiceErrorsDeclaration
  | ServiceErrorsImplementation;

// Types
export type ErrorTypeUnion<L extends ErrorLabel = ErrorLabel> =
  | ErrorTypeDeclaration<L>
  | ErrorTypeImplementation<L>;

export type RequestTypeUnion =
  | RequestTypeDeclaration
  | RequestTypeImplementation;

export type ResponseTypeUnion = AbstractResponseType<
  QueryServiceUnion,
  SubscriptionServiceUnion
>;

export type ResponseTypeChildrenUnion = AbstractResponseTypeChildren<
  QueryServiceUnion,
  SubscriptionServiceUnion
>;
