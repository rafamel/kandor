import { RPCSpecRequest } from './specification';
import { RPCNotification } from './notification';

export type RPCBatchRequest = Array<RPCRequest | RPCNotification>;

/**
 * An extension for the *request object* as specified by the
 * [*JSON-RPC 2.0 Specification.*](https://www.jsonrpc.org/specification)
 *
 * The `stream` property allows to notify the server that multiple
 * responses for a single request *id* are expected.
 * See [these](https://groups.google.com/forum/#!msg/json-rpc/EWnUwcTmOjY/x-1_beeIJPoJ)
 * [threads](https://groups.google.com/forum/#!msg/json-rpc/5PcrYSfzavA/cLW5buMC48EJ)
 * for relevant discussion.
 *
 * It should also be noted that as there are no cases in which a `null`
 * value for *id* will be valid in our implementation -it is forbidden.
 */
export interface RPCRequest extends RPCSpecRequest {
  id: string | number;
  /**
   * The service route, with `:` as a *scope* delimiter.
   */
  method: string;
  /**
   * Input data taken by the service.
   */
  params?: object | null;
  /**
   * Setting it to `true` will only be valid for subscription services.
   */
  stream?: boolean;
}

export interface RPCUnaryRequest extends RPCRequest {
  stream?: false;
}

export interface RPCStreamRequest extends RPCRequest {
  stream: true;
}
