import { compile } from 'json-schema-to-typescript';
import { Type } from '~/types';

export async function compileTypings(types: {
  [key: string]: Type;
}): Promise<string> {
  let content = '';

  const entries = Object.entries(types);
  for (const [key, value] of entries) {
    if (value.kind !== 'error') {
      content += (await compile(value.schema, key)) + '\n';
    }
  }

  return content.trim();
}
