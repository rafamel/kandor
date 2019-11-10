import fs from 'fs';
import {
  CollectionTree,
  CollectionTreeImplementation,
  Service,
  ElementInfo,
  RequestType
} from '~/types';
import { typings } from './typings';
import { replace, lift } from '~/transform';
import { isElementService, isServiceSubscription } from '~/inspect';
import { application } from '~/application';
import Ajv from 'ajv';
import draft04 from 'ajv/lib/refs/json-schema-draft-04.json';

const ajv = new Ajv({ schemaId: 'id', logger: false });
ajv.addMetaSchema(draft04);

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
  mapService: (service: Service, info: ElementInfo) => string;
}

export async function client(
  collection: CollectionTree | Promise<CollectionTree>,
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
        mapService(service: Service, info: ElementInfo): string {
          let body = `return app['${info.route.join(':')}']`;
          body += `.resolve(data, getContext())`;
          body += opts.typescript ? ` as any;` : `;`;
          return body;
        }
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
      resolve: custom.mapService(element as any, info)
    };
  });

  let importObservable = false;
  const [start, end] = [0, 1].map(() =>
    (String(Math.random()) + String(Math.random())).replace(/\./g, '')
  );

  const normal = lift(source) as CollectionTreeImplementation;
  const { routes } = application(normal, {
    validate: false,
    children: true,
    map(service): any {
      const requestType = normal.types[
        service.request as string
      ] as RequestType;
      const emptyObjectValid = ajv.compile(requestType.schema)({});

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
