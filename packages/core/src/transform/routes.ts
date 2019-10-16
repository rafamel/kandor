import { CollectionTree, CollectionRoutes } from '~/types';
import { traverse } from '~/inspect/traverse';
import {
  isElementService,
  isElementTree,
  isTreeCollection,
  isElementType
} from '~/inspect/is';

export interface RoutesTransformOptions {
  /**
   * A non word character containing string. Default: `':'`.
   */
  separator: string;
}

/**
 * Given a collection, returns an object with *values* of all services, and *keys* of their full route. It will throw if a collection:
 * - Contains conflicting routes.
 * - Has a scope name equal to a service of its parent.
 * - Contains services or scopes with an empty name or with non word characters.
 */
export function routes<T extends CollectionTree>(
  collection: T,
  options?: RoutesTransformOptions
): CollectionRoutes<T> {
  const opts = Object.assign({ separator: ':' }, options);
  const routes: CollectionRoutes<any> = {};

  if (!/[^\w]/.exec(opts.separator)) {
    throw Error(`Separator must contain a non word character`);
  }

  traverse({ ...collection, types: {} }, (element, next, { route }) => {
    if (isElementTree(element) && isTreeCollection(element)) return next();
    if (isElementType(element)) return;

    const end = route[route.length - 1];
    if (!end) {
      throw Error(`Empty strings are not permitted as scope or service names`);
    }
    if (/[^\w]/.exec(end)) {
      throw Error(
        `Non word characters are not permitted for scope or service names: ${end}`
      );
    }

    if (isElementTree(element)) {
      if (Object.hasOwnProperty.call(element.services, end)) {
        throw Error(
          `Scopes can't have the same name as one of the services of its parent: ${end}`
        );
      }
      return next();
    } else if (isElementService(element)) {
      const str = route.join(opts.separator);
      if (Object.hasOwnProperty.call(routes, str)) {
        throw Error(`Collection routes collision: ${str}`);
      }
      routes[str] = element;
    }
  });

  return routes;
}
