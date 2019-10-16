import { CollectionTree, CollectionRoutes } from '~/types';
import { traverse } from '~/inspect/traverse';
import { isElementService } from '~/inspect/is';
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
): CollectionRoutes<T> {
  const opts = Object.assign({ separator: ':', children: true }, options);
  const routes: CollectionRoutes<any> = {};

  if (!/[^\w]/.exec(opts.separator)) {
    throw Error(`Separator must contain a non word character`);
  }

  traverse(normalize(collection), (element, next, { route }) => {
    if (!isElementService(element)) return next();

    const str = route.join(opts.separator);
    if (Object.hasOwnProperty.call(routes, str)) {
      throw Error(`Collection routes collision: ${str}`);
    }
    routes[str] = element;
  });

  return routes;
}
