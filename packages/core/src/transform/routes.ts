import { CollectionTree, ServicesRoutes } from '~/types';
import { traverse } from '~/inspect/traverse';
import { isElementService, isElementType, isTypeResponse } from '~/inspect/is';
import { normalize } from './normalize';

export interface RoutesTransformOptions {
  /**
   * A non word character containing string. Default: `':'`.
   */
  separator?: string;
  /**
   * Whether to include response types with children as routes. Default: `true`.
   */
  children?: boolean;
}

/**
 * Given a collection, it will normalize it -see `normalize`- and return an object with *values* of all services, and *keys* of their full route.
 */
export function routes<T extends CollectionTree>(
  collection: T,
  options?: RoutesTransformOptions
): ServicesRoutes<T> {
  const opts = Object.assign({ separator: ':', children: true }, options);
  const routes: ServicesRoutes<any> = {};

  if (!/[^\w]/.exec(opts.separator)) {
    throw Error(`Separator must contain a non word character`);
  }

  traverse(normalize(collection), (element, next, { route }) => {
    if (isElementService(element)) {
      const str = route.join(opts.separator);
      if (Object.hasOwnProperty.call(routes, str)) {
        throw Error(`Collection routes collision: ${str}`);
      }
      routes[str] = element;
    } else if (isElementType(element)) {
      if (opts.children && isTypeResponse(element) && element.children) {
        const name = route[route.length - 1];
        const entries = Object.entries(element.children);
        for (const [key, service] of entries) {
          const str = name + opts.separator + key;
          if (Object.hasOwnProperty.call(routes, str)) {
            throw Error(`Collection routes collision: ${str}`);
          }
          routes[str] = service;
        }
      }
    } else {
      return next();
    }
  });

  return routes;
}
