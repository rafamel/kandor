import { RPCClient } from '@karmic/rpc';
import { WSClientOptions } from './types';
import { createDefaults } from './defaults';
import { connect } from './connect';
import WebSocket from 'isomorphic-ws';

export class WSClient extends RPCClient {
  /**
   * `wso` options -options for `ws`- don't have any effect on browsers.
   */
  public constructor(
    address: string,
    options?: WSClientOptions | null,
    wso?: WebSocket.ClientOptions
  ) {
    const opts = Object.assign(createDefaults(), options);
    const connection = connect(
      address,
      opts.context,
      wso || {},
      opts.attempts,
      opts.connectTimeout
    );
    super(connection, opts);
  }
}
