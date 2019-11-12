import {
  CollectionTreeImplementation,
  ApplicationResolve,
  Application,
  ApplicationServices
} from '~/types';
import { validate, traverse, isElementService, atPath } from '~/inspect';
import { addInterceptResponse } from './helpers/intercept-response';
import { mergeIntercepts } from './helpers/merge-intercepts';
import { getRoutes } from './helpers/get-routes';
import { toDeclaration } from '~/transform';
import { ApplicationCreateOptions } from './types';
import { createDefaults, defaultMap } from './defaults';
import { mergeFallback } from './helpers/merge-fallback';
import { removeChildren } from './helpers/remove-children';

// TODO: routes from camel/pascal case to _ or - separated + validate + implement for REST
/**
 * Validates and prepares a collection to be used:
 * - Merges service intercepts into each route resolver.
 * - Ensures services fail with a `PublicError` and resolve with `null` for empty responses.
 * - Ensures `ServerError` and `ClientError` error types exist on the collection declaration.
 */
export function application<T extends CollectionTreeImplementation>(
  collection: T,
  options?: ApplicationCreateOptions
): Application {
  const opts = Object.assign(createDefaults(), options);

  const merge = mergeFallback(collection, opts.fallback, defaultMap);

  let tree: CollectionTreeImplementation = merge.collection;
  if (opts.validate) validate(tree, { as: 'implementation' });
  if (opts.children) tree = removeChildren(tree);
  tree = addInterceptResponse(tree);
  tree = mergeIntercepts(tree);

  const declaration = toDeclaration(tree);
  const routes = getRoutes(tree, opts.map);

  return {
    declaration,
    fallback: merge.fallback,
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
