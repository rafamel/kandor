import {
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  AbstractElement,
  ElementInfo,
  ElementUnion
} from '~/types';
import { replace } from '~/transform/replace';

export type TraverseInputFn<
  Q extends QueryServiceUnion = QueryServiceUnion,
  M extends MutationServiceUnion = MutationServiceUnion,
  S extends SubscriptionServiceUnion = SubscriptionServiceUnion
> = (
  element: AbstractElement<Q, M, S>,
  info: ElementInfo,
  next: (element?: AbstractElement<Q, M, S>) => AbstractElement<Q, M, S>
) => void;

/**
 * Performs a tree traversal. Alternative to `replace`.
 */
export function traverse(
  element: ElementUnion,
  cb: TraverseInputFn,
  info?: Required<ElementInfo>
): void {
  replace(
    element,
    (element, info, next) => {
      cb(element, info, () => next());
      return element;
    },
    info
  );
}
