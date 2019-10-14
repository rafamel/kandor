import fs from 'fs';
import { CollectionTreeApplication } from '~/types';
import { compile } from 'json-schema-to-typescript';
import camelcase from 'camelcase';

export interface TypingsGenerateOptions {
  /**
   * Path to optionally write the result into a file. Default: `null`.
   */
  write?: string | null;
}

export async function typings(
  collection: CollectionTreeApplication,
  options?: TypingsGenerateOptions
): Promise<string> {
  const opts = { write: null, ...options };

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

  content = content.trim() + '\n';

  const { write } = opts;
  if (write) {
    await new Promise((resolve, reject) => {
      fs.writeFile(write, content, (err) => (err ? reject(err) : resolve()));
    });
  }

  return content;
}
