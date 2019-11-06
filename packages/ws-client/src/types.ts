import { RPCClientOptions } from '@karmic/rpc';

export type WSClientOptions = WSClientOptionsOnly & RPCClientOptions;

export interface WSClientOptionsOnly {
  /**
   * Attempt connection an arbitrary number of times on failure. `0` for *infinity.* Default: `0`.
   */
  attempts?: number;
  /**
   * Connection timeout in milliseconds. It will cause all pending requests to fail. `0` for *infinity.* Default: `7500`.
   */
  connectTimeout?: number;
  /**
   * A context object to be passed to the server as a query parameter.
   */
  context?: object;
}
