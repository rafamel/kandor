import { CollectionTreeDeclaration } from '@karmic/core';
import { RPCClient } from './RPCClient';

/**
 * Obtains a declaration from a server using any *Karmic*'s RPC client.
 */
export async function obtain(
  client: RPCClient
): Promise<CollectionTreeDeclaration> {
  const declaration = await client.unary(':declaration');
  client.close();
  return declaration;
}
