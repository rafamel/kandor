import {
  Service,
  Element,
  Tree,
  Type,
  CollectionTree,
  ScopeTree,
  TreeTypes,
  TreeServices,
  ErrorType,
  RequestType,
  ResponseType,
  ResponseTypeChildren
} from './collection';
import { QueryService, MutationService, SubscriptionService } from './services';

// Groups
export type AppElement = Element<
  QueryService,
  MutationService,
  SubscriptionService
>;
export type AppTree = Tree<QueryService, MutationService, SubscriptionService>;
export type AppType = Type<QueryService, SubscriptionService>;
export type AppService<I = any, O = any> = Service<
  QueryService<I, O>,
  MutationService<I, O>,
  SubscriptionService<I, O>
>;

// Tree
export type AppCollectionTree = CollectionTree<
  QueryService,
  MutationService,
  SubscriptionService
>;
export type AppScopeTree = ScopeTree<
  QueryService,
  MutationService,
  SubscriptionService
>;
export type AppTreeTypes = TreeTypes<QueryService, SubscriptionService>;
export type AppTreeServices = TreeServices<
  QueryService,
  MutationService,
  SubscriptionService
>;

// Types
export type AppErrorType = ErrorType;
export type AppRequestType = RequestType;
export type AppResponseType<I = any, O = any> = ResponseType<
  QueryService<I, O>,
  SubscriptionService<I, O>
>;
export type AppResponseTypeChildren<I = any, O = any> = ResponseTypeChildren<
  QueryService<I, O>,
  SubscriptionService<I, O>
>;
