import { client, CollectionTree, ClientGenerateOptions } from '@karmic/core';

/**
 * Code generator for a collection's RPC client.
 */
export async function generate(
  collection: CollectionTree | Promise<CollectionTree>,
  options?: ClientGenerateOptions
): Promise<string> {
  const opts = Object.assign(
    { typescript: true, write: null, headComments: true },
    options
  );

  return client(await collection, opts, {
    headInclude: opts.typescript
      ? `import RPCClient from '@karmic/rpc-client';`
      : undefined,
    mapDefault(str) {
      let fn = `function createClient(rpc`;
      fn += opts.typescript ? `: RPCClient) {\n` : `) {\n`;
      fn += `  return ` + str.replace(/\n/g, '\n  ');
      fn += `}`;
      return fn;
    },
    mapService(element, info) {
      return `return rpc.${element.kind}('${info.route.join(':')}', data);`;
    }
  });
}
