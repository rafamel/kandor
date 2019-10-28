import { QueryServiceImplementation } from '@karmic/core';
import { DataOutput, DataInput, DataParser } from '~/types';

export interface RPCServerOptions {
  /**
   * Whether to create routes for type's children services.
   * Default: `true`.
   */
  children?: boolean;
  /**
   * Serializer and deserializer
   */
  parser?: DataParser;
  /**
   * A default service for adapters to use when the route is non existent.
   * Defaults to a `ClientNotFound` error throwing service.
   */
  default?: QueryServiceImplementation;
}

export interface RPCServerConnect {
  send: (data: DataOutput) => void | Promise<void>;
  fatal: (error: Error) => void;
}

export type RPCServerProvideContext<T = any> = () => Promise<T> | T;

export interface RPCServerConnection {
  request: (data: DataInput) => void;
  close: () => void;
}
