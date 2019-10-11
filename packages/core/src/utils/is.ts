import { Tree, CollectionTree, Element, Service, Type } from '~/types';

export function isTreeCollection(tree: Tree): tree is CollectionTree {
  return Object.hasOwnProperty.call(tree, 'types');
}

export function isElementService(element: Element): element is Service {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isElementType(element: Type): element is Type {
  return ['error', 'request', 'response'].includes(element.kind);
}
