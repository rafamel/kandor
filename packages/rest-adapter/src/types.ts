import { Router, Request } from 'express';
import {
  QueryServiceImplementation,
  PublicError,
  CollectionTreeDeclaration
} from '@karmic/core';

/**
 * REST adapter output.
 */
export interface RESTAdapter {
  /**
   * An *express* router with the input collection's routes.
   */
  router: Router;
  /**
   * Resulting collection declaration, including the necessary
   * modifications made by the adapter.
   */
  declaration: CollectionTreeDeclaration;
}

export interface RESTAdapterOptions {
  /**
   * Whether to modify the routes of services named `get`, `list`, `create`, `update`, `patch`, and `remove` to follow traditional RESTful conventions. Default: `true`.
   */
  crud?: boolean;
  /**
   * Whether to create routes for type's children services. Default: `true`.
   */
  children?: boolean;
  /**
   * Whether to create routes for subscription services, serving their first result. Default: `true`.
   */
  subscriptions?: boolean;
  /**
   * Path to serve the collection declaration JSON at, if any. Default: `/:declaration`.
   */
  declaration?: string | null;
  /**
   * A function to provide context before services are called.
   */
  context?: RESTContextFn;
  // TODO: we need to know how the types are modified by the envelope
  /**
   * A function returning the final data to serve.
   */
  envelope?: RESTEnvelopeFn;
  /**
   * A service handling not found routes.
   */
  notFound?: QueryServiceImplementation;
}

export type RESTContextFn<C = any> = (req: Request) => Promise<C> | Partial<C>;

export type RESTEnvelopeFn<T = any> = (
  error: null | PublicError,
  data: any
) => T;
