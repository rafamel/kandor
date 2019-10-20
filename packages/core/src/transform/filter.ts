import {
  QueryService,
  MutationService,
  SubscriptionService,
  AbstractElement,
  ElementInfo,
  AbstractCollectionTree
} from '~/types';
import { replace } from '~/transform/replace';
import {
  isElementTree,
  isTreeCollection,
  isElementType,
  isTypeResponse
} from '~/inspect';

export type FilterTransformFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (element: AbstractElement<Q, M, S>, info: ElementInfo) => boolean;

/**
 * Performs a traversal, returning a new collection where `Element`s are deleted when `cb` returns false. Inline types cannot be filtered.
 */
export function filter<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  collection: AbstractCollectionTree<Q, M, S>,
  cb: FilterTransformFn<Q, M, S>
): AbstractCollectionTree<Q, M, S> {
  return replace(collection, (element, info, next) => {
    if (isElementTree(element)) {
      if (isTreeCollection(element)) {
        element = { ...element, types: { ...element.types } };
        for (const [key, value] of Object.entries(element.types)) {
          const path = info.path.concat(['types', key]);
          const route = info.route.concat([key]);
          if (!cb(value, { path, route })) {
            delete element.types[key];
          }
        }
      }
      element = { ...element, services: { ...element.services } };
      for (const [key, value] of Object.entries(element.services)) {
        const path = info.path.concat(['services', key]);
        const route = info.route.concat([key]);
        if (!cb(value, { path, route })) {
          delete element.services[key];
        }
      }
    } else if (
      isElementType(element) &&
      isTypeResponse(element) &&
      element.children
    ) {
      const children = { ...element.children };
      for (const [key, value] of Object.entries(children)) {
        const path = info.path.concat(['children', key]);
        const route = info.route.concat([key]);
        if (!cb(value, { path, route })) {
          delete children[key];
        }
      }
      element = { ...element, children };
    }

    return next(element);
  });
}
