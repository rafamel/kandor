import {
  CollectionTree,
  TreeTypes,
  QueryService,
  SubscriptionService,
  NormalCollection
} from '~/types';
import camelcase from 'camelcase';
import { normalizeServiceTypes } from './helpers';
import { replace } from '../replace';
import { isElementType, isElementService, isElementTree } from '~/inspect/is';

/**
 * Extracts all service inline types of a collection to its top level `CollectionTree.types`, naming them according to their scope, service, and kind. It additionally transforms all type names to pascal case. It will throw if a collection:
 * - Produces conflicting type names.
 * - Contains references to non existent types.
 * - Contains types with an empty name or with non word characters.
 * - Contains services with inline types or type references of the wrong kind.
 */
export function normalize<T extends CollectionTree>(
  collection: T
): NormalCollection<T> {
  const transform = (str: string, isExplicit: boolean) => {
    return camelcase(str, { pascalCase: true });
  };

  const types = {
    source: collection.types,
    normal: Object.entries(collection.types).reduce(
      (acc: TreeTypes, [name, type]) => {
        const pascal = transform(name, true);
        if (Object.hasOwnProperty.call(acc, pascal)) {
          throw Error(`Type name collision: ${pascal}`);
        }
        acc[pascal] = type;
        return acc;
      },
      {}
    )
  };

  return {
    ...replace(collection, (element, next, { route }) => {
      if (isElementTree(element)) {
        return next(element);
      }

      const name = transform(route[route.length - 1], true);

      if (isElementType(element)) {
        if (element.kind !== 'response' || !element.children) {
          return element;
        }

        const response = { ...element, children: element.children };
        for (const [key, service] of Object.entries(element.children)) {
          response.children[key] = normalizeServiceTypes(
            name + transform(key, false),
            service,
            types,
            transform
          ) as QueryService | SubscriptionService;
        }
        return response;
      }

      if (isElementService(element)) {
        return normalizeServiceTypes(
          route.length > 1
            ? transform(route[route.length - 2], false) + name
            : name,
          element,
          types,
          transform
        );
      }

      return element;
    }),
    types: types.normal
  } as NormalCollection<T>;
}
