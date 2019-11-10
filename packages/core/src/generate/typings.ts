import fs from 'fs';
import { CollectionTree } from '~/types';
import { compile } from 'json-schema-to-typescript';
import { lift } from '~/transform/lift';

export interface TypingsGenerateOptions {
  /**
   * Path to optionally write the result into a file. Default: `null`.
   */
  write?: string | null;
  /**
   * Enables head comments disabling *tslint* and *eslint*. Default: `true`.
   */
  headComments?: boolean;
}

export async function typings(
  collection: CollectionTree | Promise<CollectionTree>,
  options?: TypingsGenerateOptions
): Promise<string> {
  const opts = { write: null, headComments: true, ...options };

  let content = '';

  if (opts.headComments) {
    content +=
      '/* eslint-disable */\n' +
      '/* tslint:disable */\n' +
      '/* This file was automatically generated. DO NOT MODIFY IT BY HAND. */\n\n';
  }

  const { types } = lift(await collection);
  for (const [key, value] of Object.entries(types)) {
    if (value.kind !== 'error') {
      content += await compile(value.schema, key, { bannerComment: '' });
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
