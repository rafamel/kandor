import {
  Tree,
  CollectionTree,
  Element,
  Service,
  Type,
  Envelope
} from '~/types';

export function isTreeCollection(tree: Tree): tree is CollectionTree {
  return Object.hasOwnProperty.call(tree, 'types');
}

export function isElementService(element: Element): element is Service {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isElementType(element: Type): element is Type {
  return ['error', 'request', 'response'].includes(element.kind);
}

export function isEnvelope(element: any): element is Envelope<any> {
  return (
    Object.hasOwnProperty.call(element, 'name') &&
    typeof element.name === 'string' &&
    Object.hasOwnProperty.call(element, 'item') &&
    typeof element.item === 'object'
  );
}
