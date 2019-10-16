import {
  QueryService,
  MutationService,
  SubscriptionService,
  CollectionTree
} from '~/types';
import { next } from './helpers';
import { ReplaceTransformFn } from './types';

/**
 * Returns a new collection where `Element`s are substituted by the ones returned by `cb`. Performs a traversal.
 */
export function replace<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  collection: CollectionTree<Q, M, S>,
  cb: ReplaceTransformFn<Q, M, S>
): CollectionTree {
  return next(collection, { path: [], route: [] }, cb as any);
}
