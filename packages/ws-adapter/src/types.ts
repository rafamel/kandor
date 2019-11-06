import http from 'http';
import WebSocket from 'ws';
import { RPCServerOptions } from '@karmic/rpc';
import { CollectionTreeDeclaration } from '@karmic/core';

export interface WSAdapter {
  /**
   * Resulting collection declaration, including the necessary
   * modifications made by the adapter.
   */
  declaration: CollectionTreeDeclaration;
  /**
   * Closes the WebSockets server and releases reasources
   * being used by all current connections.
   */
  terminate: () => void;
}

export type RPCAdapterOptions = RPCServerOptions & RPCAdapterOptionsOnly;

export interface RPCAdapterOptionsOnly {
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
  context?: RPCAdapterProvideContext;
}

export type RPCAdapterProvideContext<T = any> = (
  context: { [key: string]: any },
  req: http.IncomingMessage,
  ws: WebSocket
) => Promise<T> | T;
