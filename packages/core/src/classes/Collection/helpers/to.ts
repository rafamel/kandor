import {
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  AbstractCollectionTree,
  CollectionTreeImplementation,
  AbstractElement,
  CollectionTreeUnion,
  CollectionTreeDeclaration,
  ElementUnion
} from '~/types';
import { CollectionImplementationInputFn } from '../definitions';
import { replace } from '~/transform/replace';
import {
  isElementService,
  isServiceImplementation,
  isServiceSubscription
} from '~/inspect/is';
import { subscribe } from 'promist';

export function toImplementation<
  Q extends QueryServiceUnion,
  M extends MutationServiceUnion,
  S extends SubscriptionServiceUnion
>(
  collection: AbstractCollectionTree<Q, M, S>,
  fn: CollectionImplementationInputFn
): CollectionTreeImplementation {
  return replace(collection, (element, info, next) => {
    element = next(element);
    return isElementService(element)
      ? (fn(element, info) as AbstractElement<Q, M, S>)
      : element;
  }) as CollectionTreeImplementation;
}

export function toDeclaration(
  collection: CollectionTreeUnion
): CollectionTreeDeclaration {
  return replace(collection, (element, info, next) => {
    element = next(element);
    if (isElementService(element) && isServiceImplementation(element)) {
      const { resolve, intercepts, ...service } = element;
      return service as ElementUnion;
    }
    return element;
  }) as CollectionTreeDeclaration;
}

export function toUnary<
  Q extends QueryServiceUnion,
  M extends MutationServiceUnion
>(
  collection: AbstractCollectionTree<Q, M, SubscriptionServiceUnion>
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
