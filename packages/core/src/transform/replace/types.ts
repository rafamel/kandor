import {
  QueryService,
  MutationService,
  SubscriptionService,
  Element
} from '~/types';

export type ReplaceTransformFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (
  element: Element<Q, M, S>,
  next: ReplaceTransformNextFn<Q, M, S>,
  data: ReplaceTransformData
) => Element;

export type ReplaceTransformNextFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (element?: Element<Q, M, S>) => Element;

export interface ReplaceTransformData {
  path: string[];
  route: string[];
}
