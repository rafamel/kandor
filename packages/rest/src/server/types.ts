import { PublicError, QueryServiceImplementation } from '@karmic/core';

export interface RESTServerOptions {
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
  // TODO: remove (unimplemented)
  /**
   * Whether to serve the collection declaration JSON at `/:declaration`. Default: `true`.
   */
  declaration?: boolean;
  // TODO: we need to know how the types are modified by the envelope
  /**
   * A function returning the final data to serve.
   */
  envelope?: RESTServerEnvelopeFn;
  /**
   * A fallback service for adapters to use when the route is non existent.
   * Defaults to a `ClientNotFound` error throwing service.
   */
  fallback?: QueryServiceImplementation;
}

export type RESTServerContextFn<T = any> = () => Promise<T> | T;

export type RESTServerEnvelopeFn<T = any> = (
  error: null | PublicError,
  data: any
) => T;

export type RESTServerMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface RESTServerResponse<T = any> {
  status: number;
  data: T;
}
