import {
  CollectionTreeImplementation,
  CollectionTreeApplication,
  CollectionTree,
  TreeTypes
} from '~/types';
import clone from 'lodash.clonedeep';
import { traverse, isElementType } from '~/utils';
import camelcase from 'camelcase';
import serviceIntercepts from './service-intercepts';
import { mergeServiceTypes } from './merge';

export default function application(
  collection: CollectionTree | CollectionTreeImplementation,
  options?: {
    prefixScope?: boolean;
    prefixInlineError?: boolean;
    transform?: (str: string, explicit: boolean) => string;
  }
): CollectionTreeApplication {
  collection = clone(collection);

  const opts = Object.assign(
    {
      prefixScope: true,
      prefixInlineError: false,
      transform: (str: string) => camelcase(str, { pascalCase: true })
    },
    options
  );

  const types = {
    source: collection.types,
    application: Object.entries(collection.types).reduce(
      (acc: TreeTypes, [name, type]) => {
        const pascal = opts.transform(name, true);
        if (Object.hasOwnProperty.call(acc, pascal)) {
          throw Error(`Type name collision: ${pascal}`);
        }
        acc[pascal] = type;
        return acc;
      },
      {}
    )
  };

  traverse(collection, { children: false, inline: false }, (element, path) => {
    const name = opts.transform(path.slice(-1)[0], true);

    if (isElementType(element)) {
      if (element.kind !== 'response' || !element.children) return;
      for (const [key, service] of Object.entries(element.children)) {
        const fullName = name + opts.transform(key, false);
        serviceIntercepts(fullName, service, types.source);
        mergeServiceTypes(fullName, service, types, opts);
      }
    } else {
      const fullName =
        opts.prefixScope && path[path.length - 3]
          ? opts.transform(path[path.length - 3], false) + name
          : name;

      serviceIntercepts(fullName, element, types.source);
      mergeServiceTypes(fullName, element, types, opts);
    }
  });

  return {
    ...collection,
    types: types.application
  } as CollectionTreeApplication;
}
