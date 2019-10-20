import {
  ElementInfo,
  QueryService,
  MutationService,
  SubscriptionService,
  AbstractElement,
  AbstractCollectionTree
} from '~/types';
import { next } from './helpers';

export type ReplaceTransformFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (
  element: AbstractElement<Q, M, S>,
  info: ElementInfo,
  next: (element?: AbstractElement<Q, M, S>) => AbstractElement<Q, M, S>
) => AbstractElement<Q, M, S>;

/**
 * Performs a traversal, returning a new collection where `Element`s are substituted by the ones returned by `cb`. Alternative to `traverse`.
 */
export function replace<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  collection: AbstractCollectionTree<Q, M, S>,
  cb: ReplaceTransformFn<Q, M, S>
): AbstractCollectionTree<Q, M, S> {
  return next(collection, { path: [], route: [] }, cb as any);
}
