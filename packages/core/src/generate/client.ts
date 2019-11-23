import fs from 'fs';
import {
  CollectionTreeUnion,
  CollectionTreeImplementation,
  ElementInfo,
  ServiceUnion
} from '~/types';
import { typings } from './typings';
import { Application, Collection, CollectionInstance } from '~/classes';
import { isElementService, isServiceSubscription } from '~/inspect/is';
import { validator } from '~/utils/validator';

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
}

export interface ClientGenerateCustomize {
  /**
   * An additional string to include at the top of the file.
   */
  headInclude?: string;
  /**
   * Maps collection default export.
   */
  mapDefault?: (str: string) => string;
  /**
   * Maps function bodies for each service.
   */
  mapService: (service: ServiceUnion, info: Required<ElementInfo>) => string;
}

export async function client(
  collection: CollectionTreeUnion | Promise<CollectionTreeUnion>,
  options?: ClientGenerateOptions | null,
  customize?: ClientGenerateCustomize
): Promise<string> {
  const opts = {
    typescript: true,
    write: null,
    headComments: true,
    ...options
  };
  const custom = customize
    ? Object.assign(
        { headInclude: '', mapDefault: (x: string) => x },
        customize
      )
    : {
        headInclude: opts.typescript
          ? `import { Application } from '@karmic/core';`
          : undefined,
        mapDefault(str: string): string {
          let fn = `function createClient(application`;
          fn += opts.typescript ? `: Application, ` : `, `;
          fn += `getContext`;
          if (opts.typescript) fn += `: () => any`;
          fn += ` = () => ({})) {\n`;
          fn += `  const app = application.flatten(':');\n\n`;
          fn += `  return ` + str.replace(/\n/g, '\n  ');
          fn += `}`;
          return fn;
        },
        mapService(service: ServiceUnion, info: Required<ElementInfo>): string {
          let body = `return app['${info.route.join(':')}']`;
          body += `.resolve(data, getContext())`;
          body += opts.typescript ? ` as any;` : `;`;
          return body;
        }
      };

  let content = '';
  const instance = new Collection(await collection);

  if (opts.typescript) {
    content += await typings(collection, {
      write: null,
      headComments: false
    });
    content += `\n`;
  }

  const source = instance.replace((element, { path, route }, next): any => {
    element = next(element);
    if (!isElementService(element)) return element;
    if (!route) throw Error(`Expected route for path: ${path}`);
    return {
      ...element,
      resolve: custom.mapService(element as any, { path, route })
    };
  });

  let importObservable = false;
  const [start, end] = [0, 1].map(() =>
    (String(Math.random()) + String(Math.random())).replace(/\./g, '')
  );

  const normal = source.lift() as CollectionInstance<
    CollectionTreeImplementation
  >;

  const { routes } = Application.create(normal, {
    validate: false,
    children: true,
    map(service): any {
      const requestType = normal.schemas[service.request as string];
      const emptyObjectValid = validator.compile(requestType.schema)({});

      let resolve = '';
      resolve += start + `function resolve(data`;
      resolve += opts.typescript ? `: ${service.request}` : ``;
      resolve += emptyObjectValid ? ` = {}` : ``;

      resolve += `)`;
      if (opts.typescript) {
        const isSubscription = isServiceSubscription(service);
        if (isSubscription) importObservable = true;
        resolve += isSubscription
          ? `: Observable<${service.response}>`
          : `: Promise<${service.response}>`;
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
  if (custom.headInclude) head += `\n` + custom.headInclude;
  if (importObservable) head += `\nimport { Observable } from 'rxjs';`;
  head += custom.headInclude || importObservable ? `\n\n` : `\n`;

  content = head + content;
  content += `export default `;
  content += custom.mapDefault(
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
