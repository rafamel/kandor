import {
  CollectionTreeDeclaration,
  CollectionTreeImplementation
} from '~/types';
import {
  UnaryApplicationResolve,
  ApplicationRoutes,
  ApplicationInput,
  ApplicationServices,
  ApplicationResolve,
  ApplicationCreateOptions
} from './definitions';
import { createDefaults, defaultMap } from './defaults';
import { mergeFallback } from './helpers/merge-fallback';
import { removeChildren } from './helpers/remove-children';
import { addInterceptResponse } from './helpers/intercept-response';
import { mergeIntercepts } from './helpers/merge-intercepts';
import { getRoutes } from './helpers/get-routes';
import { Collection } from '../Collection';
import { isElementService } from '~/inspect/is';
import { atPath } from '~/inspect/at';

export class Application {
  // TODO: routes from camel/pascal case to _ or - separated + validate + implement for REST
  /**
   * Validates and prepares a collection to be used as an `Application`:
   * - Merges service intercepts into each route resolver.
   * - Ensures services fail with a `PublicError` and resolve with `null` for empty responses.
   * - Ensures `ServerError` and `ClientError` error types exist on the collection declaration.
   */
  public static create(
    collection: CollectionTreeImplementation,
    options?: ApplicationCreateOptions
  ): Application {
    const opts = Object.assign(createDefaults(), options);

    const merge = mergeFallback(collection, opts.fallback, defaultMap);

    let tree = merge.collection;
    if (opts.validate) tree.validate({ as: 'implementation' });
    if (opts.children) tree = removeChildren(tree);
    tree = addInterceptResponse(tree);
    tree = mergeIntercepts(tree);

    const declaration = tree.toDeclaration();
    const routes = getRoutes(tree, opts.map);
    return new Application({
      declaration,
      fallback: merge.fallback,
      routes
    });
  }
  public readonly declaration: CollectionTreeDeclaration;
  public readonly fallback: UnaryApplicationResolve;
  public readonly routes: ApplicationRoutes;
  public constructor(application: ApplicationInput) {
    this.declaration = application.declaration;
    this.fallback = application.fallback;
    this.routes = application.routes;
  }
  public flatten(delimiter: string): ApplicationServices {
    if (!/[^\w]/.exec(delimiter)) {
      throw Error(
        `Delimiter must include at least a non wod character: ${delimiter}`
      );
    }

    const services: ApplicationServices = {};

    Collection.create(this.declaration).traverse((element, info, next) => {
      next();
      if (isElementService(element)) {
        if (!info.route) throw Error(`Expected route on path: ${info.path}`);
        services[info.route.join(delimiter)] = {
          declaration: element as any,
          resolve: atPath(
            this.routes,
            info.route,
            (x: any): x is ApplicationResolve => typeof x === 'function'
          )
        };
      }
    });

    return services;
  }
}
