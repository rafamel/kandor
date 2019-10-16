import {
  QueryService,
  MutationService,
  SubscriptionService,
  CollectionTree
} from '~/types';
import { next } from './helpers';
import { ReplaceTransformFn } from './types';

/**
 * Performs a traversal, returning a new collection where `Element`s are substituted by the ones returned by `cb`. Alternative to `traverse`.
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
