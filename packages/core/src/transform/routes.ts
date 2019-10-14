import { CollectionTree, Routes } from '~/types';
import {
  traverse,
  isElementService,
  isElementTree,
  isTreeScope
} from '~/inspect';

export interface RoutesTransformOptions {
  /**
   * A non word character containing string that separates
   */
  separator: string;
}

/**
 * Given a collection, returns an object with *values* of all services, and *keys* of their full route. It will throw if a collection:
 * - Contains services with an empty name or with non word characters.
 * - Contains conflicting routes.
 * - Has a scope name equal to a service of its parent.
 */
export function routes<T extends CollectionTree>(
  collection: T,
  options?: RoutesTransformOptions
): Routes<T> {
  const opts = Object.assign({ separator: ':' }, options);
  const routes: Routes<any> = {};

  if (!/[^\w]/.exec(opts.separator)) {
    throw Error(`Separator must contain a non word character`);
  }

  traverse(
    { ...collection, types: {} },
    (element, { route }) => {
      if (
        !isElementService(element) &&
        !(isElementTree(element) && isTreeScope(element))
      ) {
        return;
      }

      const end = route[route.length - 1];
      if (!end) {
        throw Error(`Empty strings are not permitted as service names`);
      }
      if (/[^\w]/.exec(end)) {
        throw Error(
          `Non word characters are not permitted on a collection: ${end}`
        );
      }

      if (isElementTree(element)) {
        if (Object.hasOwnProperty.call(element.services, end)) {
          throw Error(
            `Scopes can't have the same name as one of the services of its parent: ${end}`
          );
        }
      } else if (isElementService(element)) {
        const str = route.join(opts.separator);
        if (Object.hasOwnProperty.call(routes, str)) {
          throw Error(`Collection routes collision: ${str}`);
        }
        routes[str] = element;
      }
    },
    { deep: true, children: false, inline: false }
  );

  return routes;
}
