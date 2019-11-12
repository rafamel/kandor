import {
  QueryService,
  SubscriptionService,
  AbstractCollectionTree,
  MutationService
} from '~/types';
import camelcase from 'camelcase';
import { replace } from '../replace';
import {
  isElementType,
  isElementService,
  isElementTree,
  isTypeResponse
} from '~/inspect/is';
import { LiftTransformOptions } from './types';
import { liftServiceTypes } from './helpers';

/**
 * Lifts inline schemas and errors to the top level of a collection, naming them according to their scope, service, and kind. It will throw if a collection:
 * - Produces conflicting type names.
 * - Contains references to non existent types.
 * - Contains services with types of the wrong kind.
 */
export function lift<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  collection: AbstractCollectionTree<Q, M, S>,
  options?: LiftTransformOptions
): AbstractCollectionTree<Q, M, S> {
  const opts = Object.assign({ skipReferences: false }, options);

  const transform = (str: string, _isExplicit: boolean): string => {
    return camelcase(str, { pascalCase: true });
  };

  const types = {
    source: collection.types,
    lift: { ...collection.types }
  };

  const result = {
    ...replace(collection, (element, { route }, next): any => {
      if (isElementTree(element)) return next(element);

      const name = transform(route[route.length - 1], true);

      if (isElementType(element)) {
        if (!isTypeResponse(element) || !element.children) {
          return element;
        }

        const response = { ...element, children: { ...element.children } };
        for (const [key, service] of Object.entries(element.children)) {
          response.children[key] = liftServiceTypes(
            name + transform(key, false),
            service,
            types,
            opts,
            transform
          ) as any;
        }
        return response;
      }

      if (isElementService(element)) {
        return liftServiceTypes(
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
    types: types.lift
  };

  return result;
}
