import { RPCClient } from '@karmic/rpc';
import { WSClientOptions } from './types';
import { createDefaults } from './defaults';
import { connect } from './connect';
import WebSocket from 'isomorphic-ws';

export class WSClient extends RPCClient {
  public constructor(
    address: string,
    wsco?: WebSocket.ClientOptions | null,
    options?: WSClientOptions
  ) {
    const opts = Object.assign(createDefaults(), options);
    const connection = connect(
      address,
      wsco || {},
      opts.attempts,
      opts.connectTimeout
    );
    super(connection, opts);
  }
}
