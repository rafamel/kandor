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

export function traverse(
  element: ElementUnion,
  cb: TraverseInputFn,
  info?: ElementInfo
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
