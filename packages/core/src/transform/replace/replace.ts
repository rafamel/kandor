import {
  QueryService,
  MutationService,
  SubscriptionService,
  Element,
  CollectionTree
} from '~/types';
import { next } from './helpers';

export type ReplaceTransformFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (
  element: Element<Q, M, S>,
  next: ReplaceTransformNextFn<Q, M, S>,
  data: ReplaceTransformData
) => Element;

export type ReplaceTransformNextFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (element?: Element<Q, M, S>) => Element;

export interface ReplaceTransformData {
  path: string[];
  route: string[];
}

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
