import { compile } from 'json-schema-to-typescript';

import { TreeTypes } from '~/types';

export async function compileTypings(
  types: TreeTypes['request'] | TreeTypes['response']
): Promise<string> {
  let content = '';

  const entries = Object.entries(types);
  for (const [key, value] of entries) {
    content += (await compile(value.schema, key)) + '\n';
  }

  return content.trim();
}
