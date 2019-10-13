import fs from 'fs';
import { CollectionTreeApplication } from '~/types';

export async function writeErrors(
  dest: string,
  collection: CollectionTreeApplication
): Promise<void> {
  fs.writeFileSync(dest, await generateErrors(collection));
}

export async function generateErrors(
  collection: CollectionTreeApplication
): Promise<string> {
  let content =
    '/* eslint-disable */\n' +
    '/* tslint:disable */\n' +
    '/* This file was automatically generated. DO NOT MODIFY IT BY HAND. */\n\n' +
    `import { PublicError } from '@karmic/core';\n\n`;

  const entries = Object.entries(collection.types);

  const names: string[] = [];
  for (const [name, value] of entries) {
    if (value.kind === 'error') {
      names.push(name);
      content +=
        `export const ${name} = new PublicError(\n` +
        `  '${name}',\n` +
        `  '${value.code}',\n` +
        `  null,\n` +
        `  ${value.description ? `'${value.description}'` : 'undefined'}\n` +
        `);\n\n`;
    }
  }

  content += `export default {`;
  for (const name of names) {
    content += `\n  ${name},`;
  }
  if (entries.length) content = content.slice(0, -1) + '\n';

  return content + '};\n';
}
