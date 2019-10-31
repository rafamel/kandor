import {
  QueryServiceImplementation,
  ElementItem,
  ErrorType
} from '@karmic/core';
import { DataOutput, DataInput, DataParser } from '~/types';
import { Observable } from 'rxjs';

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
   * An error to emit if a stream completes before emitting any values.
   * Defaults to an *EarlyCompleteError* `ServerError`.
   */
  complete?: ElementItem<ErrorType>;
  /**
   * A fallback service for adapters to use when the route is non existent.
   * Defaults to a `ClientNotFound` error throwing service.
   */
  fallback?: QueryServiceImplementation;
}

export interface RPCServerConnection {
  /**
   * A function to be run to provide context.
   */
  context?: RPCServerConnectionContextFn;
  /**
   * Connection actions.
   */
  actions: RPCServerConnectionActions;
  /**
   * It must *complete* if the connection has been closed.
   */
  data$: Observable<DataInput>;
}

export interface RPCServerConnectionActions {
  /**
   * Fatal errors will be reported via the `report` callback.
   * It is the connection's responsibility to close
   * itself in response, if deemed adequate.
   */
  report: (error: Error) => void;
  /**
   * Data to be sent to this client will be passed to `send`.
   */
  send: (data: DataOutput) => void | Promise<void>;
  /**
   * Should close the connection.
   */
  close: () => void;
}

export type RPCServerConnectionContextFn<T = any> = () => Promise<T> | T;
