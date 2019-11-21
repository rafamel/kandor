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

export function replace<T extends ElementUnion>(
  element: T,
  cb: ReplaceInputFn,
  info?: ElementInfo
): T {
  return next(element, cb as any, info);
}
