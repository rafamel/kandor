import fs from 'fs';
import { CollectionTreeUnion } from '~/types';
import { compile } from 'json-schema-to-typescript';
import { Collection } from '~/classes';

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
  collection: CollectionTreeUnion | Promise<CollectionTreeUnion>,
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

  const { schemas } = new Collection(await collection).lift();
  for (const [key, value] of Object.entries(schemas)) {
    content += await compile(value.schema, key, { bannerComment: '' });
    content += '\n';
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
