import {
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  AbstractElement,
  ElementInfo,
  ElementUnion
} from '~/types';
import { next } from './helpers';

export type ReplaceInputFn<
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
export function replace<T extends ElementUnion>(
  element: T,
  cb: ReplaceInputFn,
  info?: Required<ElementInfo>
): T {
  return next(element, cb as any, info);
}
