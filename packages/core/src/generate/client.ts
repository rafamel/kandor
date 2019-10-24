import fs from 'fs';
import {
  CollectionTree,
  CollectionTreeImplementation,
  Service,
  ElementInfo
} from '~/types';
import { typings } from './typings';
import { replace, normalize } from '~/transform';
import { isElementService, isServiceSubscription } from '~/inspect';
import { application } from '~/application';

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
  /**
   * Maps collection default export.
   */
  mapDefault?: (str: string) => string;
}

export async function client(
  collection: CollectionTree | Promise<CollectionTree>,
  resolver: (service: Service, info: ElementInfo) => string,
  options?: ClientGenerateOptions
): Promise<string> {
  const opts = {
    typescript: true,
    write: null,
    headComments: true,
    headInclude: '',
    mapDefault: (str: string): string => str,
    ...options
  };

  let content = '';
  collection = await collection;

  if (opts.typescript) {
    content += await typings(collection, {
      write: null,
      headComments: false
    });
    content += `\n`;
  }

  const source = replace(collection, (element, info, next): any => {
    element = next(element);
    if (!isElementService(element)) return element;
    return {
      ...element,
      resolve: resolver(element as any, info)
    };
  });

  let importObservable = false;
  const [start, end] = [0, 1].map(() =>
    (String(Math.random()) + String(Math.random())).replace(/\./g, '')
  );
  const { routes } = application(
    normalize(source) as CollectionTreeImplementation,
    {
      validate: false,
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
    }
  );

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
  content += opts.mapDefault(
    JSON.stringify(routes, null, 2)
      .replace(new RegExp('"' + start, 'g'), '')
      .replace(new RegExp(end + '"', 'g'), '')
  );
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
