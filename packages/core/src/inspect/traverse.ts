import {
  QueryService,
  MutationService,
  SubscriptionService,
  Element,
  CollectionTree
} from '~/types';
import { replace } from '~/transform';

export type TraverseInspectFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (element: Element<Q, M, S>, data: TraverseInspectData) => void;

export interface TraverseInspectData {
  path: string[];
  route: string[];
}

export interface TraverseInspectOptions {
  /**
   * Whether to traverse a collection's inner scopes. Default: `true`.
   */
  deep?: boolean;
  /**
   * Whether to traverse type's children services. Default: `false`.
   */
  children?: boolean;
  /**
   * Whether to traverse types within services. Default: `false`.
   */
  inline?: boolean;
}

/**
 * Performs a collection traversal, with `cb` being called (top-down) for each `Element`.
 */
export function traverse<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
>(
  collection: CollectionTree<Q, M, S>,
  cb: TraverseInspectFn<Q, M, S>,
  options?: TraverseInspectOptions
): void {
  replace(
    collection,
    (element, data) => {
      cb(element, data);
      return element;
    },
    options
  );
}
