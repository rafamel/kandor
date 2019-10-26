import http from 'http';
import WebSocket from 'ws';
import {
  CollectionTreeDeclaration,
  ElementItem,
  ErrorType
} from '@karmic/core';

/**
 * RPC adapter output.
 */
export interface RPCAdapter {
  /**
   * Resulting collection declaration, including the necessary
   * modifications made by the adapter.
   */
  declaration: CollectionTreeDeclaration;
}

export interface RPCAdapterOptions {
  /**
   * Whether to create routes for type's children services. Default: `true`.
   */
  children?: boolean;
  /**
   * Whether to allow for subscription services to be queried as unary
   * for a single result.
   */
  querySubscriptions?: boolean;
  /**
   * Frequency at which broken connection checks are run at
   * to free up resources in milliseconds. Default: `60000`.
   */
  heartbeat?: number;
  /**
   * A *ws* `WebSocket.Server`.
   * Default: `new WebSocket.Server({ noServer: true })`.
   */
  server?: WebSocket.Server;
  /**
   * A function to be run for each connection to provide context.
   */
  context?: ContextFn;
  /**
   * An error definition for route errors.
   */
  routeError?: ElementItem<ErrorType<'ClientNotFound'>>;
}

export type ContextFn<T extends object = object> = (
  req: http.IncomingMessage,
  ws: WebSocket
) => Promise<T> | T;
