import {
  InputService,
  QueryService,
  MutationService,
  SubscriptionService,
  FreeItem
} from '~/types';
import { inputServiceToItem } from './input-to-item';

export function query<I, O, N extends string>(
  name: N,
  service: InputService<QueryService<I, O>>
): FreeItem<QueryService<I, O>, N> {
  return inputServiceToItem(name, 'query', service);
}

export function mutation<I, O, N extends string>(
  name: N,
  service: InputService<MutationService<I, O>>
): FreeItem<MutationService<I, O>, N> {
  return inputServiceToItem(name, 'mutation', service);
}

export function subscription<I, O, N extends string>(
  name: N,
  service: InputService<SubscriptionService<I, O>>
): FreeItem<SubscriptionService<I, O>, N> {
  return inputServiceToItem(name, 'subscription', service);
}
