import {
  QueryService,
  MutationService,
  SubscriptionService,
  Element,
  CollectionTree
} from '~/types';
import { replaceTree } from './helpers';

export type ReplaceTransformFn<
  IQ extends QueryService = QueryService,
  IM extends MutationService = MutationService,
  IS extends SubscriptionService = SubscriptionService,
  OQ extends QueryService = IQ,
  OM extends MutationService = IM,
  OS extends SubscriptionService = IS
> = (
  element: Element<IQ, IM, IS>,
  data: ReplaceTransformData
) => Element<OQ, OM, OS>;

export interface ReplaceTransformData {
  path: string[];
  route: string[];
}

export interface ReplaceTransformOptions {
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
  /**
   * Stops traversing deeper if an upper element is returned that is not shallow equal to the previous element. Default: `true`.
   */
  stop?: boolean;
}

/**
 * Returns a new collection where `Element`s are substituted by the ones returned by `cb`. Performs a traversal, with `cb` being called (top-down) for each `Element`.
 */
export function replace<
  IQ extends QueryService,
  IM extends MutationService,
  IS extends SubscriptionService,
  OQ extends QueryService,
  OM extends MutationService,
  OS extends SubscriptionService
>(
  collection: CollectionTree<IQ, IM, IS>,
  cb: ReplaceTransformFn<IQ, IM, IS>,
  options?: ReplaceTransformOptions
): CollectionTree<OQ, OM, OS> {
  return replaceTree(
    collection,
    { path: [], route: [] },
    cb as any,
    Object.assign(
      { deep: true, children: false, inline: false, stop: true },
      options
    )
  ) as CollectionTree<OQ, OM, OS>;
}
