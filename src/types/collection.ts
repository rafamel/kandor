import { ErrorCode } from './error';
import { Schema } from './schema';
import { Observable } from './observable';

export type Element = Tree | Type | Service;
export type Tree = CollectionTree | ScopeTree;
export type Type = ErrorType | RequestType | ResponseType;
export type Service = QueryService | MutationService | SubscriptionService;

// Tree
export interface CollectionTree {
  types: TreeTypes;
  services: TreeServices;
  scopes: { [key: string]: ScopeTree };
}
export interface ScopeTree {
  services: TreeServices;
  scopes: { [key: string]: ScopeTree };
}
export interface TreeTypes {
  error: { [key: string]: ErrorType };
  request: { [key: string]: RequestType };
  response: { [key: string]: ResponseType };
}
export interface TreeServices {
  query: { [key: string]: QueryService };
  mutation: { [key: string]: MutationService };
  subscription: { [key: string]: SubscriptionService };
}

// Types
export interface ErrorType {
  code: ErrorCode;
}
export interface RequestType {
  schema: Schema;
}
export interface ResponseType<T = any> {
  schema: Schema;
  children: ResponseTypeChildren<T>;
}
export interface ResponseTypeChildren<I = any> {
  query: { [key: string]: QueryService<I> };
  subscription: { [key: string]: SubscriptionService<I> };
}

// Services
export interface QueryService<I = any, O = any> {
  types: ServiceTypes;
  resolve(data: I, context: any): O | Promise<O>;
}
export interface MutationService<I = any, O = any> {
  types: ServiceTypes;
  resolve(data: I, context: any): O | Promise<O>;
}
export interface SubscriptionService<I = any, O = any> {
  types: ServiceTypes;
  resolve(
    data: I,
    context: any
  ): Observable<O | Promise<O>> | Promise<Observable<O | Promise<O>>>;
}
export interface ServiceTypes {
  errors: string[];
  request: string;
  response: string;
}
