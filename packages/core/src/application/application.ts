import {
  CollectionTreeImplementation,
  ApplicationResolve,
  Application,
  ApplicationServices
} from '~/types';
import { validate, traverse, isElementService, atPath } from '~/inspect';
import { addInterceptResponse } from './helpers/intercept-response';
import { mergeIntercepts } from './helpers/merge-intercepts';
import { handleChildren } from './helpers/handle-children';
import { getRoutes } from './helpers/get-routes';
import { toDeclaration } from '~/transform';
import { ApplicationCreateOptions } from './types';
import { createDefaults, defaultMap } from './defaults';
import { mergeDefault } from './helpers/merge-default';

/**
 * Validates and prepares a collection to be used:
 * - Merges service intercepts into each route resolver.
 * - Ensures services fail with a `PublicError` and resolve with `null` for empty responses.
 * - Ensures `ServerError` and `ClientError` error types exist on the collection declaration.
 * - Names and lifts inline types to the collection root if they have children services.
 */
export function application<T extends CollectionTreeImplementation>(
  collection: T,
  options?: ApplicationCreateOptions
): Application {
  const opts = Object.assign(createDefaults(), options);

  const merge = mergeDefault(collection, opts.default, defaultMap);

  let tree: CollectionTreeImplementation = merge.collection;
  if (opts.validate) validate(tree, { as: 'implementation' });
  tree = handleChildren(tree, opts.children ? 'lift' : 'remove');
  tree = addInterceptResponse(tree);
  tree = mergeIntercepts(tree);

  const declaration = toDeclaration(tree);
  const routes = getRoutes(tree, opts.map);

  return {
    declaration,
    default: merge.default,
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
