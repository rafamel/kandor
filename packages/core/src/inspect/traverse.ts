import {
  QueryService,
  MutationService,
  SubscriptionService,
  Element,
  CollectionTree
} from '~/types';
import { replace } from '~/transform/replace';

export type TraverseInspectFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (
  element: Element<Q, M, S>,
  next: TraverseInspectNextFn,
  data: TraverseInspectData
) => void;

export type TraverseInspectNextFn = () => void;

export interface TraverseInspectData {
  path: string[];
  route: string[];
}

/**
 * Performs a collection traversal. Alternative to `replace`.
 */
export function traverse<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
>(collection: CollectionTree<Q, M, S>, cb: TraverseInspectFn<Q, M, S>): void {
  replace(collection, (element, next, data) => {
    cb(element, () => next(), data);
    return element;
  });
}
