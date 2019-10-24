import {
  CollectionTreeImplementation,
  ApplicationResolve,
  ServiceImplementation,
  ElementInfo,
  Application,
  ApplicationServices
} from '~/types';
import { validate, traverse, isElementService, atPath } from '~/inspect';
import { addInterceptErrors } from './intercept-errors';
import { mergeIntercepts } from './merge-intercepts';
import { handleChildren } from './handle-children';
import { getRoutes } from './get-routes';
import { toDeclaration } from '~/transform';

export interface ApplicationCreateOptions {
  /**
   * Whether the collection should be validated - see `validate`. Default: `true`.
   */
  validate?: boolean;
  /**
   * Whether to include response types with children as routes. Default: `true`.
   */
  children?: boolean;
  /**
   * Maps a service to its route resolver.
   */
  map?: ApplicationCreateMapFn;
}

export type ApplicationCreateMapFn<I = any, O = any, C = any> = (
  service: ServiceImplementation<I, O, C>,
  info: ElementInfo
) => ApplicationResolve<I, O, C>;

/**
 * Validates and prepares a collection to be used:
 * - Adds `ServerError` and `ClientError` error types, if non existent, to the collection declaration.
 * - Handles children adequately according to whether they have children services.
 * - Merges service intercepts into each route resolver, and makes them fail with `PublicError`s, if they don't already do.
 */
export function application<T extends CollectionTreeImplementation>(
  collection: T,
  options?: ApplicationCreateOptions
): Application {
  const opts = Object.assign(
    {
      validate: true,
      children: true,
      map(service: ServiceImplementation, info: ElementInfo) {
        return (data: any, context: any) => {
          return service.resolve(data, context, info);
        };
      }
    },
    options
  );

  let tree: CollectionTreeImplementation = collection;
  if (opts.validate) validate(tree, { as: 'implementation' });
  tree = handleChildren(tree, opts.children ? 'lift' : 'remove');
  tree = addInterceptErrors(tree);
  tree = mergeIntercepts(tree);

  const declaration = toDeclaration(tree);
  const routes = getRoutes(tree, opts.map);

  return {
    declaration,
    routes,
    flatten(delimiter: string): ApplicationServices {
      if (!/[^\w]/.exec(delimiter)) {
        throw Error(
          `Delimiter must include at least a non wod character: ${delimiter}`
        );
      }

      const services: ApplicationServices = {};
      traverse(declaration, (element, info, next) => {
        next();
        if (isElementService(element)) {
          services[info.route.join(delimiter)] = {
            declaration: element,
            resolve: atPath(
              routes,
              info.route,
              (x: any): x is ApplicationResolve => typeof x === 'function'
            )
          };
        }
      });

      return services;
    }
  };
}
