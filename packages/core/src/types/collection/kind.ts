export type ElementKind =
  | TreeElementKind
  | ServiceElementKind
  | TypeElementKind;

export type TreeElementKind = CollectionTreeKind | ScopeTreeKind;
export type CollectionTreeKind = 'collection';
export type ScopeTreeKind = 'scope';

export type ServiceElementKind =
  | QueryServiceKind
  | MutationServiceKind
  | SubscriptionServiceKind;
export type QueryServiceKind = 'query';
export type MutationServiceKind = 'mutation';
export type SubscriptionServiceKind = 'subscription';

export type TypeElementKind =
  | ErrorTypeKind
  | RequestTypeKind
  | ResponseTypeKind;
export type ErrorTypeKind = 'error';
export type RequestTypeKind = 'request';
export type ResponseTypeKind = 'response';
