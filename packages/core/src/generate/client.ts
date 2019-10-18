import fs from 'fs';
import {
  CollectionTree,
  GenericService,
  CollectionTreeImplementation
} from '~/types';
import { typings } from './typings';
import { replace, ReplaceTransformData, normalize, routes } from '~/transform';
import { isElementService, isServiceSubscription } from '~/inspect';

export interface ClientGenerateOptions {
  /**
   * Generate with typings. Default: `true`.
   */
  typescript?: boolean;
  /**
   * Path to optionally write the result into a file. Default: `null`.
   */
  write?: string | null;
  /**
   * Enables head comments disabling *tslint* and *eslint*. Default: `true`.
   */
  headComments?: boolean;
  /**
   * An additional string to include at the top of the file.
   */
  headInclude?: string;
}

export type ClientGenerateFn<T extends CollectionTree = CollectionTree> = (
  service: GenericService<T>,
  data: ReplaceTransformData
) => string;

export async function client<T extends CollectionTree>(
  collection: T,
  resolver: ClientGenerateFn<T>,
  options?: ClientGenerateOptions
): Promise<string> {
  const opts = {
    typescript: true,
    write: null,
    headComments: true,
    headInclude: '',
    ...options
  };

  let content = '';

  if (opts.typescript) {
    content += await typings(collection, {
      write: null,
      headComments: false
    });
    content += `\n`;
  }

  const source = replace(collection, (element, next, data) => {
    element = next(element);
    if (!isElementService(element)) return element;

    return {
      ...element,
      resolve: resolver(element as any, data)
    };
  }) as CollectionTreeImplementation;

  let importObservable = false;
  const [start, end] = [0, 1].map(() =>
    (String(Math.random()) + String(Math.random())).replace(/\./g, '')
  );
  const { tree } = routes(normalize(source), {
    children: true,
    map(service): any {
      let resolve = '';
      resolve += start + `function resolve(data`;
      resolve += opts.typescript ? `: ${service.types.request}` : ``;
      resolve += `)`;
      if (opts.typescript) {
        const isSubscription = isServiceSubscription(service);
        if (isSubscription) importObservable = true;
        resolve += isSubscription
          ? `: Observable<${service.types.response}>`
          : `: Promise<${service.types.response}>`;
      }
      resolve += ` { `;
      resolve += service.resolve;
      resolve += ` }` + end;

      return resolve;
    }
  });

  let head = '';
  if (opts.headComments) {
    head +=
      '/* eslint-disable */\n' +
      '/* tslint:disable */\n' +
      '/* This file was automatically generated. DO NOT MODIFY IT BY HAND. */\n';
  }
  if (opts.headInclude) head += `\n` + opts.headInclude;
  if (importObservable) head += `\nimport { Observable } from 'rxjs';`;
  head += opts.headInclude || importObservable ? `\n\n` : `\n`;

  content = head + content;
  content += `export default `;
  content += JSON.stringify(tree, null, 2)
    .replace(new RegExp('"' + start, 'g'), '')
    .replace(new RegExp(end + '"', 'g'), '');
  content += `;`;

  content = content.trim() + '\n';
  const { write } = opts;
  if (write) {
    await new Promise((resolve, reject) => {
      fs.writeFile(write, content, (err) => (err ? reject(err) : resolve()));
    });
  }

  return content;
}
