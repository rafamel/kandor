import fs from 'fs';
import { CollectionTreeApplication } from '~/types';
import { compile } from 'json-schema-to-typescript';
import camelcase from 'camelcase';

export async function writeTypings(
  dest: string,
  collection: CollectionTreeApplication
): Promise<void> {
  fs.writeFileSync(dest, await generateTypings(collection));
}

export async function generateTypings(
  collection: CollectionTreeApplication
): Promise<string> {
  let content =
    '/* eslint-disable */\n' +
    '/* tslint:disable */\n' +
    '/* This file was automatically generated. DO NOT MODIFY IT BY HAND. */\n\n';

  for (const [key, value] of Object.entries(collection.types)) {
    if (value.kind !== 'error') {
      content += await compile(
        value.schema,
        camelcase(key, { pascalCase: true }),
        { bannerComment: '' }
      );
      content += '\n';
    }
  }

  return content.trim() + '\n';
}
