export type ElementKind =
  | TreeKind
  | ServiceKind
  | ExceptionKind
  | SchemaKind
  | ChildrenKind;

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

export type ExceptionKind = 'exception';
export type SchemaKind = 'schema';
export type ChildrenKind = 'children';
