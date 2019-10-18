import {
  CollectionTree,
  CollectionTreeImplementation,
  Service,
  UnaryCollection
} from '~/types';
import { replace } from './replace';
import {
  isElementService,
  isServiceImplementation,
  isServiceSubscription
} from '~/inspect';

export function toImplementation<T extends CollectionTree>(
  collection: T,
  fn: (service: Service, data: { path: string[]; route: string[] }) => Service
): T & CollectionTreeImplementation {
  return replace(collection, (element, next, data) => {
    element = next(element);
    return isElementService(element) ? fn(element, data) : element;
  }) as T & CollectionTreeImplementation;
}

export function toDeclaration(collection: CollectionTree): CollectionTree {
  return replace(collection, (element, next) => {
    element = next(element);

    if (isElementService(element) && isServiceImplementation(element)) {
      const { resolve, ...service } = element;
      return service;
    }

    return element;
  });
}

export function toUnary<T extends CollectionTree>(
  collection: T
): UnaryCollection<T> {
  return replace(collection, (element, next) => {
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
        return resolve.apply(this, args).toPromise();
      }
    };
  }) as UnaryCollection<T>;
}
