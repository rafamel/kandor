import {
  QueryService,
  MutationService,
  SubscriptionService,
  ServiceItem,
  InputService,
  InputHook
} from '~/types';
import { inputServiceToItem } from './input-to-item';
import { setServiceHooks } from './hooks';

export function query(
  service: InputService<QueryService>,
  hooks?: InputHook | InputHook[]
): ServiceItem<QueryService> {
  return hooks
    ? setServiceHooks(inputServiceToItem('query', service), hooks)
    : inputServiceToItem('query', service);
}

export function mutation(
  service: InputService<MutationService>,
  hooks?: InputHook | InputHook[]
): ServiceItem<MutationService> {
  return hooks
    ? setServiceHooks(inputServiceToItem('mutation', service), hooks)
    : inputServiceToItem('mutation', service);
}

export function subscription(
  service: InputService<SubscriptionService>,
  hooks?: InputHook | InputHook[]
): ServiceItem<SubscriptionService> {
  return hooks
    ? setServiceHooks(inputServiceToItem('subscription', service), hooks)
    : inputServiceToItem('subscription', service);
}
