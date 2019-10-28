import { RPCClientConnectionStatus } from './connection';
import { DataParser } from '~/types';

export type RPCClientStatus = RPCClientConnectionStatus | 'complete';

export interface RPCClientOptions {
  /**
   * Timeout for request's first result when connected in milliseconds. `0` for *infinity.* It will cause all pending requests to fail. Default: `30000`.
   */
  responseTimeout?: number;
  /**
   * On subscriptions:
   * - `'fail'`: behaves normally, failing on connection timeout and errors, and response timeouts and errors.
   * - `'await-connection'`: it will only fail for response timeouts and errors, waiting for reconnection. Once connection is available, it will refetch. If `reconnect` has a limit, it will fail once it is reached too.
   * - `'no-fail'`: It will only fail if `reconnect` has a limit and it is reached. When response timeouts and errors occur, they will be notified as global errors, and the request will be sent yet again.
   * Default: `'fail'`.
   */
  subscribePolicy?: SubscribePolicy;
  /**
   * After a subscription observable is subscribed to at least once, when it is unsubscribed:
   * - `'complete'`: will send an *unsubscribe* signal to the server and any future subscription will instantly complete, without any values being streamed.
   * - `'refetch'`: will send an *unsubscribe* signal to the server so it can free up resources, and re-subscribe if it is subscribed to again.
   * - `'keep-alive'`: will never send an *unsubscribe* signal to the server. Not recommended.
   * Default: `'complete'`.
   */
  unsubscribePolicy?: UnsubscribePolicy;
  /**
   * Serializer and deserializer
   */
  parser?: DataParser;
}

export type SubscribePolicy = 'fail' | 'await-connection' | 'no-fail';

export type UnsubscribePolicy = 'complete' | 'refetch' | 'keep-alive';
