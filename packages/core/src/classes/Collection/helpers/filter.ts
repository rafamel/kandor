import {
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  AbstractCollectionTree
} from '~/types';
import { CollectionFilterInputFn } from '../definitions';
import { replace } from '~/transform/replace';
import { isElementTree, isTreeCollection } from '~/inspect/is';

/**
 * Performs a traversal, returning a new collection where `Element`s are deleted when `cb` returns false. Inline exceptions and schemas cannot be filtered.
 */
export function filter<
  Q extends QueryServiceUnion,
  M extends MutationServiceUnion,
  S extends SubscriptionServiceUnion
>(
  collection: AbstractCollectionTree<Q, M, S>,
  fn: CollectionFilterInputFn<Q, M, S>
): AbstractCollectionTree<Q, M, S> {
  return replace(collection, (element, info, next) => {
    if (isElementTree(element)) {
      if (!info.route) throw Error(`Route expected for tree`);

      if (isTreeCollection(element)) {
        element = {
          ...element,
          exceptions: { ...element.exceptions },
          schemas: { ...element.schemas },
          children: { ...element.children }
        };
        for (const [key, value] of Object.entries(element.exceptions)) {
          const path = info.path.concat(['exceptions', key]);
          if (!fn(value, { path })) {
            delete element.exceptions[key];
          }
        }
        for (const [key, value] of Object.entries(element.schemas)) {
          const path = info.path.concat(['schemas', key]);
          if (!fn(value, { path })) {
            delete element.schemas[key];
          }
        }
        for (const [key, value] of Object.entries(element.children)) {
          const path = info.path.concat(['children', key]);
          const route = info.route.concat(key);
          if (!fn(value as any, { path, route })) {
            delete element.exceptions[key];
          }
        }
      }

      element = {
        ...element,
        services: { ...element.services },
        scopes: { ...element.scopes }
      };
      for (const [key, value] of Object.entries(element.services)) {
        const path = info.path.concat(['services', key]);
        const route = info.route.concat([key]);
        if (!fn(value as any, { path, route })) {
          delete element.services[key];
        }
      }
      for (const [key, value] of Object.entries(element.scopes)) {
        const path = info.path.concat(['scopes', key]);
        const route = info.route.concat([key]);
        if (!fn(value as any, { path, route })) {
          delete element.scopes[key];
        }
      }
    }

    return next(element);
  });
}
