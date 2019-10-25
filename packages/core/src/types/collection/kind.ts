export type ElementKind = TreeKind | ServiceKind | TypeKind;

export type TreeKind = CollectionTreeKind | ScopeTreeKind;
export type CollectionTreeKind = 'collection';
export type ScopeTreeKind = 'scope';

export type ServiceKind =
  | QueryServiceKind
  | MutationServiceKind
  | SubscriptionServiceKind;
export type QueryServiceKind = 'query';
export type MutationServiceKind = 'mutation';
export type SubscriptionServiceKind = 'subscription';

export type TypeKind = ErrorTypeKind | RequestTypeKind | ResponseTypeKind;
export type ErrorTypeKind = 'error';
export type RequestTypeKind = 'request';
export type ResponseTypeKind = 'response';
