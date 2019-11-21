import {
  ElementInfo,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  AbstractElement,
  AbstractCollectionTree
} from '~/types';
import { next } from './helpers';

export type ReplaceTransformFn<
  Q extends QueryServiceUnion = QueryServiceUnion,
  M extends MutationServiceUnion = MutationServiceUnion,
  S extends SubscriptionServiceUnion = SubscriptionServiceUnion
> = (
  element: AbstractElement<Q, M, S>,
  info: ElementInfo,
  next: (element?: AbstractElement<Q, M, S>) => AbstractElement<Q, M, S>
) => AbstractElement<Q, M, S>;

/**
 * Performs a traversal, returning a new collection where `Element`s are substituted by the ones returned by `cb`. Alternative to `traverse`.
 */
export function replace<
  Q extends QueryServiceUnion,
  M extends MutationServiceUnion,
  S extends SubscriptionServiceUnion
>(
  collection: AbstractCollectionTree<Q, M, S>,
  cb: ReplaceTransformFn<Q, M, S>
): AbstractCollectionTree<Q, M, S> {
  return next(collection, { path: [], route: [] }, cb as any);
}
