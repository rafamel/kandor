import WebSocket from 'isomorphic-ws';
import RPCClient from './client';
import { CollectionTreeDeclaration } from '@karmic/core';

/**
 * Obtains a declaration from a server using *Karmic*'s RPC adapter.
 */
export async function obtain(
  address: string,
  wsco?: WebSocket.ClientOptions
): Promise<CollectionTreeDeclaration> {
  const rpcClient = new RPCClient(address, wsco);
  const declaration = await rpcClient.query(':declaration');
  rpcClient.close();
  return declaration;
}
