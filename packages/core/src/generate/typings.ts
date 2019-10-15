import fs from 'fs';
import { CollectionTree } from '~/types';
import { compile } from 'json-schema-to-typescript';
import camelcase from 'camelcase';
import { normalize } from '~/transform';

export interface TypingsGenerateOptions {
  /**
   * Path to optionally write the result into a file. Default: `null`.
   */
  write?: string | null;
}

export async function typings(
  collection: CollectionTree,
  options?: TypingsGenerateOptions
): Promise<string> {
  const opts = { write: null, ...options };

  let content =
    '/* eslint-disable */\n' +
    '/* tslint:disable */\n' +
    '/* This file was automatically generated. DO NOT MODIFY IT BY HAND. */\n\n';

  const { types } = normalize(collection);
  for (const [key, value] of Object.entries(types)) {
    if (value.kind !== 'error') {
      content += await compile(
        value.schema,
        camelcase(key, { pascalCase: true }),
        { bannerComment: '' }
      );
      content += '\n';
    }
  }

  content = content.trim() + '\n';

  const { write } = opts;
  if (write) {
    await new Promise((resolve, reject) => {
      fs.writeFile(write, content, (err) => (err ? reject(err) : resolve()));
    });
  }

  return content;
}
