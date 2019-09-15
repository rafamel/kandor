import { ErrorCode } from '../error';
import { Schema } from '../schema';
import { ServiceDefinition } from './services';

// Groups
export type Element<
  Q extends ServiceDefinition = ServiceDefinition,
  M extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> = Tree<Q, M, S> | Type<Q, S> | Service<Q, M, S>;

export type Tree<
  Q extends ServiceDefinition = ServiceDefinition,
  M extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> = CollectionTree<Q, M, S> | ScopeTree;

export type Type<
  Q extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> = ErrorType | RequestType | ResponseType<Q, S>;

export type Service<
  Q extends ServiceDefinition = ServiceDefinition,
  M extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> = Q | M | S;

// Tree
export interface CollectionTree<
  Q extends ServiceDefinition = ServiceDefinition,
  M extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> {
  types: TreeTypes<Q, S>;
  services: TreeServices<Q, M, S>;
  scopes: { [key: string]: ScopeTree<Q, M, S> };
}

export interface ScopeTree<
  Q extends ServiceDefinition = ServiceDefinition,
  M extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> {
  services: TreeServices<Q, M, S>;
  scopes: { [key: string]: ScopeTree<Q, M, S> };
}

export interface TreeTypes<
  Q extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> {
  error: { [key: string]: ErrorType };
  request: { [key: string]: RequestType };
  response: { [key: string]: ResponseType<Q, S> };
}

export interface TreeServices<
  Q extends ServiceDefinition = ServiceDefinition,
  M extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> {
  query: { [key: string]: Q };
  mutation: { [key: string]: M };
  subscription: { [key: string]: S };
}

// Types
export interface ErrorType {
  code: ErrorCode;
}

export interface RequestType {
  schema: Schema;
}

export interface ResponseType<
  Q extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> {
  schema: Schema;
  children: ResponseTypeChildren<Q, S>;
}

export interface ResponseTypeChildren<
  Q extends ServiceDefinition = ServiceDefinition,
  S extends ServiceDefinition = ServiceDefinition
> {
  query: { [key: string]: Q };
  subscription: { [key: string]: S };
}
