import {
  CollectionTree,
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
  isTreeCollection,
  isTypeResponse
} from '~/inspect/is';
import { NormalizeTransformOptions } from './types';

/**
 * Extracts all service inline types of a collection to its top level `CollectionTree.types`, naming them according to their scope, service, and kind. It will throw if a collection:
 * - Produces conflicting type names.
 * - Contains references to non existent types.
 * - Has a scope name equal to a service of its parent.
 * - Has a type name starting with a lowercase letter or equal to a collection root service name.
 * - Contains types, services, or scopes with an empty name or with non word characters.
 * - Contains services with inline types or type references of the wrong kind.
 */
export function normalize<T extends CollectionTree>(
  collection: T,
  options?: NormalizeTransformOptions
): NormalCollection<T> {
  const opts = Object.assign(
    { skipReferences: false, liftInlineType: () => true },
    options
  );

  const transform = (str: string, _isExplicit: boolean): string => {
    return camelcase(str, { pascalCase: true });
  };

  const types = {
    source: collection.types,
    normal: { ...collection.types }
  };

  const lowercase = Object.keys(collection.types).filter(
    (x) => x[0] && x[0] !== x[0].toUpperCase()
  );
  if (lowercase.length) {
    throw Error(`Types must start with an uppercase letter`);
  }

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
        if (!isTypeResponse(element) || !element.children) {
          return element;
        }

        const response = { ...element, children: { ...element.children } };
        for (const [key, service] of Object.entries(element.children)) {
          response.children[key] = normalizeServiceTypes(
            name + transform(key, false),
            service,
            types,
            opts,
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
          opts,
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
