import { compile } from 'json-schema-to-typescript';
import { Type } from '~/types';

export async function compileTypings(types: {
  [key: string]: Type;
}): Promise<string> {
  let content =
    '/* eslint-disable */\n' +
    '/* tslint:disable */\n' +
    '/* This file was automatically generated. DO NOT MODIFY IT BY HAND. */\n\n';

  const entries = Object.entries(types);
  for (const [key, value] of entries) {
    if (value.kind !== 'error') {
      content +=
        (await compile(value.schema, key, { bannerComment: '' })) + '\n';
    }
  }

  return content.trim();
}
