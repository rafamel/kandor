import {
  client,
  CollectionTreeUnion,
  ClientGenerateOptions
} from '@karmic/core';

/**
 * Code generator for a collection's RPC client.
 */
export async function generate(
  collection: CollectionTreeUnion | Promise<CollectionTreeUnion>,
  options?: ClientGenerateOptions
): Promise<string> {
  const opts = Object.assign({ typescript: true }, options);

  return client(await collection, opts, {
    headInclude: opts.typescript
      ? `import { RPCClient } from '@karmic/rpc';`
      : undefined,
    mapDefault(str) {
      let fn = `function createClient(client`;
      fn += opts.typescript ? `: RPCClient) {\n` : `) {\n`;
      fn += `  return ` + str.replace(/\n/g, '\n  ');
      fn += `}`;
      return fn;
    },
    mapService(element, info) {
      const fn = element.kind === 'subscription' ? 'stream' : 'unary';
      return `return client.${fn}('${info.route.join(':')}', data);`;
    }
  });
}
