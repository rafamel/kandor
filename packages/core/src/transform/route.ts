import {
  CollectionTree,
  ServicesTree,
  ServicesRoutes,
  GenericCollection,
  Service,
  ResponseTypeChildren,
  GenericService
} from '~/types';
import {
  isElementService,
  isElementType,
  isTypeResponse,
  isElementTree
} from '~/inspect/is';
import { normalize } from './normalize';
import { replace, ReplaceTransformData } from './replace';

export interface RouteTransform<T extends CollectionTree> {
  collection: GenericCollection<T>;
  routes: ServicesRoutes<T>;
  tree: ServicesTree<T>;
}

export interface RouteTransformOptions<
  T extends CollectionTree = CollectionTree
> {
  /**
   * Whether to include response types with children as routes. Default: `true`.
   */
  children?: boolean;
  /**
   * A non word character containing string. Default: `':'`.
   */
  separator?: string;
  /**
   * Maps services. Default: `(service) => service`.
   */
  map?: (service: GenericService<T>, data: ReplaceTransformData) => Service;
}

/**
 * Given a collection, it will return an object with *values* of all services, and *keys* of their full route.
 */
export function route<T extends CollectionTree>(
  collection: T,
  options?: RouteTransformOptions<T>
): RouteTransform<T> {
  const opts = Object.assign(
    {
      children: true,
      separator: ':',
      map: (service: Service, _data: ReplaceTransformData) => service
    },
    options
  );

  if (!/[^\w]/.exec(opts.separator)) {
    throw Error(`Separator must contain a non word character`);
  }

  collection = opts.children
    ? (normalize(collection, {
        liftInlineType(type) {
          if (!isTypeResponse(type) || !type.children) return false;
          return Object.keys(type.children).length > 0;
        }
      }) as any)
    : (replace(collection, (element, next) => {
        element = next(element);
        if (
          isElementType(element) &&
          isTypeResponse(element) &&
          element.children
        ) {
          const { children, ...other } = element;
          return other;
        }
        return element;
      }) as any);

  const routes: ServicesRoutes<any> = {};
  const responses: ServicesTree<any> = {};
  const flatter: any = replace(
    collection,
    (element, next, { route, path }): any => {
      if (isElementService(element)) {
        const str = route.join(opts.separator);
        if (Object.hasOwnProperty.call(routes, str)) {
          throw Error(`Collection routes collision: ${str}`);
        }
        const service = opts.map(element, { route, path });
        routes[str] = service;
        return service;
      }
      if (isElementType(element)) {
        if (!isTypeResponse(element) || !element.children) return element;

        const entries = Object.entries(element.children);
        if (!entries.length) return element;

        const name = route[route.length - 1];

        const children: ResponseTypeChildren = {};
        for (const [key, service] of entries) {
          const str = name + opts.separator + key;
          if (Object.hasOwnProperty.call(routes, str)) {
            throw Error(`Collection routes collision: ${str}`);
          }
          const result = opts.map(service, {
            route: route.concat([key]),
            path: path.concat(['children', key])
          });
          children[key] = result as any;
          routes[str] = result;
        }
        responses[name] = { ...children };

        return { ...element, children };
      }

      element = next(element);
      return isElementTree(element)
        ? { ...element.scopes, ...element.services }
        : element;
    }
  );

  return {
    collection: collection as any,
    routes,
    tree: { ...responses, ...flatter }
  };
}
