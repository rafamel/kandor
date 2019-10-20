import {
  QueryService,
  MutationService,
  SubscriptionService,
  ElementInfo,
  AbstractCollectionTree,
  AbstractElement
} from '~/types';
import { replace } from '~/transform/replace';

export type TraverseInspectFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (
  element: AbstractElement<Q, M, S>,
  info: ElementInfo,
  next: () => void
) => void;

/**
 * Performs a tree traversal. Alternative to `replace`.
 */
export function traverse<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
>(
  collection: AbstractCollectionTree<Q, M, S>,
  cb: TraverseInspectFn<Q, M, S>
): void {
  replace(collection, (element, info, next) => {
    cb(element as any, info, () => next());
    return element;
  });
}
