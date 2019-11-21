import {
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  ElementInfo,
  AbstractCollectionTree,
  AbstractElement
} from '~/types';
import { replace } from '~/transform/replace';

export type TraverseInspectFn<
  Q extends QueryServiceUnion = QueryServiceUnion,
  M extends MutationServiceUnion = MutationServiceUnion,
  S extends SubscriptionServiceUnion = SubscriptionServiceUnion
> = (
  element: AbstractElement<Q, M, S>,
  info: ElementInfo,
  next: () => void
) => void;

/**
 * Performs a tree traversal. Alternative to `replace`.
 */
export function traverse<
  Q extends QueryServiceUnion = QueryServiceUnion,
  M extends MutationServiceUnion = MutationServiceUnion,
  S extends SubscriptionServiceUnion = SubscriptionServiceUnion
>(
  collection: AbstractCollectionTree<Q, M, S>,
  cb: TraverseInspectFn<Q, M, S>
): void {
  replace(collection, (element, info, next) => {
    cb(element as any, info, () => next());
    return element;
  });
}
