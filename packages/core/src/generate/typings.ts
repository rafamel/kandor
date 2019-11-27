import fs from 'fs';
import { CollectionTreeUnion } from '~/types';
import { compile } from 'json-schema-to-typescript';
import { Collection } from '~/classes';
import { isElementService } from '~/inspect';
import { containsKey } from 'contains-key';

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

  // Schemas
  const instance = Collection.ensure(await collection).lift();
  for (const [key, value] of Object.entries(instance.schemas)) {
    content += await compile(value.schema, key, { bannerComment: '' });
    content += '\n';
  }

  // Nullables
  const hash: Record<string, true> = {};
  instance.traverse((element, info, next) => {
    if (isElementService(element)) {
      if (typeof element.response !== 'string') {
        throw Error(
          `Expected lifted collection service.response to be a string`
        );
      }
      if (
        element.nullable &&
        (!containsKey(hash, element.response) as boolean)
      ) {
        const nullable = 'Nullable' + element.response;
        if (containsKey(instance.schemas, nullable)) {
          throw Error(`Duplicate type: ${nullable}`);
        }
        hash[element.response] = true;
        content += `export type ${nullable} = ${element.response} | null;\n`;
      }
    }

    return next();
  });

  content = content.trim() + '\n';
  const { write } = opts;
  if (write) {
    await new Promise((resolve, reject) => {
      fs.writeFile(write, content, (err) => (err ? reject(err) : resolve()));
    });
  }

  return content;
}
