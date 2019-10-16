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
import {
  isElementType,
  isElementService,
  isElementTree,
  isTreeCollection
} from '~/inspect/is';

export interface NormalizeTransformOptions {
  /**
   * Doesn't check reference types do exist in a collection. Default: `false`.
   */
  skipReferences?: boolean | string[];
}

/**
 * Extracts all service inline types of a collection to its top level `CollectionTree.types`, naming them according to their scope, service, and kind. It additionally transforms all type names to pascal case. It will throw if a collection:
 * - Produces conflicting type names.
 * - Contains references to non existent types.
 * - Has a scope name equal to a service of its parent.
 * - Has a type name equal to a collection root service name.
 * - Contains types, services, or scopes with an empty name or with non word characters.
 * - Contains services with inline types or type references of the wrong kind.
 */
export function normalize<T extends CollectionTree>(
  collection: T,
  options?: NormalizeTransformOptions
): NormalCollection<T> {
  const opts = Object.assign({ skipReferences: false }, options);

  const transform = (str: string, _isExplicit: boolean): string => {
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

  const result = {
    ...replace(collection, (element, next, { route }) => {
      if (isElementTree(element) && isTreeCollection(element)) {
        return next(element);
      }

      const name = transform(route[route.length - 1], true);
      if (!name) {
        throw Error(
          `Empty strings are not permitted as type, service, or scope names`
        );
      }
      if (/[^\w]/.exec(name)) {
        throw Error(
          `Non word characters are not permitted for type, service, or scope names: ${name}`
        );
      }

      if (isElementTree(element)) {
        const scopes = Object.keys(element.scopes);
        const conflictingScopes = scopes.length
          ? Object.keys(element.services).filter((name) =>
              scopes.includes(name)
            )
          : [];
        if (conflictingScopes.length) {
          throw Error(
            `Scopes can't have the same name as one of the services of its parent: ${conflictingScopes[0]}`
          );
        }
        return next(element);
      }

      if (isElementType(element)) {
        if (element.kind !== 'response' || !element.children) {
          return element;
        }

        const response = { ...element, children: element.children };
        for (const [key, service] of Object.entries(element.children)) {
          response.children[key] = normalizeServiceTypes(
            name + transform(key, false),
            service,
            opts.skipReferences,
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
          opts.skipReferences,
          types,
          transform
        );
      }

      return element;
    }),
    types: types.normal
  } as NormalCollection<T>;

  const rootServices = Object.keys(result.services);
  const conflictingTypes = rootServices.length
    ? Object.keys(result.types).filter((name) => rootServices.includes(name))
    : [];
  if (conflictingTypes.length) {
    throw Error(
      `Types can't have a name equal to a collection root service name: ${conflictingTypes[0]}`
    );
  }

  return result;
}
