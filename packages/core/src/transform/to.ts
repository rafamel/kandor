import {
  CollectionTree,
  CollectionTreeImplementation,
  ServiceElement,
  CollectionTreeDeclaration,
  AbstractCollectionTree,
  QueryService,
  MutationService,
  SubscriptionService,
  ElementInfo,
  ServiceElementImplementation
} from '~/types';
import { replace } from './replace';
import {
  isElementService,
  isServiceImplementation,
  isServiceSubscription
} from '~/inspect';
import { subscribe } from 'promist';

export function toImplementation<T extends CollectionTree>(
  collection: T,
  fn: (
    service: ServiceElement,
    info: ElementInfo
  ) => ServiceElementImplementation
): T & CollectionTreeImplementation {
  return replace(collection, (element, info, next) => {
    element = next(element);
    return isElementService(element) ? fn(element, info) : element;
  }) as T & CollectionTreeImplementation;
}

export function toDeclaration(
  collection: CollectionTree
): CollectionTreeDeclaration {
  return replace(collection, (element, info, next): any => {
    element = next(element);

    if (isElementService(element) && isServiceImplementation(element)) {
      const { resolve, intercepts, ...service } = element;
      return service;
    }

    return element;
  }) as CollectionTreeDeclaration;
}

export function toUnary<
  Q extends QueryService,
  M extends MutationService,
  T extends AbstractCollectionTree<Q, M, SubscriptionService>
>(
  collection: T & AbstractCollectionTree<Q, M, SubscriptionService>
): AbstractCollectionTree<Q, M, never> {
  return replace(collection, (element, info, next): any => {
    element = next(element);

    if (!isElementService(element) || !isServiceSubscription(element)) {
      return element;
    }

    if (!isServiceImplementation(element)) {
      return { ...element, kind: 'query' };
    }

    const resolve: any = element.resolve;
    return {
      ...element,
      kind: 'query',
      resolve(...args: any): Promise<any> {
        return subscribe(resolve.apply(this, args));
      }
    };
  }) as AbstractCollectionTree<Q, M, never>;
}
