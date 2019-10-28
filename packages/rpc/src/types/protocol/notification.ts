import { RPCSpecNotification } from './specification';

export type RPCNotification = RPCCompleteNotification;

/**
 * Routes -*methods*- starting with `:` are reserved for internal services.
 * This is the case for `:complete`, which is the only use case for
 * *JSON-RPC 2.0* notifications within our implementation.
 * This is a bidirectional method, meaning both the server and client
 * can emit it, either to stop a data stream, or to notify of its completion.
 */
export interface RPCCompleteNotification extends RPCSpecNotification {
  method: ':complete';
  params: { id: string | number };
}
