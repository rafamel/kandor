import { Tree, CollectionTree, Element, Service, Type } from '~/types';

export function isTreeCollection(tree: Tree): tree is CollectionTree {
  return Object.hasOwnProperty.call(tree, 'types');
}

export function isElement(item: any): item is Element {
  return (
    typeof item === 'object' &&
    item !== null &&
    Object.hasOwnProperty.call(item, 'kind')
  );
}

export function isElementService(element: Element): element is Service {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isElementType(element: Type): element is Type {
  return ['error', 'request', 'response'].includes(element.kind);
}
