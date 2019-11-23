import {
  CollectionTreeUnion,
  TreeUnion,
  TreeImplementation,
  ServiceUnion,
  ServiceImplementation,
  ChildrenUnion,
  ChildrenImplementation
} from '~/types';
import { isTreeCollection, isElementService } from './element';
import { containsKey } from 'contains-key';
import { traverse } from '../traverse';

export function isTreeImplementation(
  tree: TreeUnion,
  fail?: boolean
): tree is TreeImplementation {
  const collection: CollectionTreeUnion = isTreeCollection(tree)
    ? tree
    : {
        kind: 'collection',
        exceptions: {},
        schemas: {},
        children: {},
        services: tree.services,
        scopes: tree.scopes
      };

  let isImplementation: null | boolean = null;
  try {
    traverse(collection, (element, info, next) => {
      element = next();

      if (isElementService(element)) {
        const is = isServiceImplementation(element);
        if (isImplementation === null) {
          isImplementation = is;
        } else if (isImplementation !== is) {
          throw Error(
            `Both service implementations and declarations were found in tree`
          );
        }
      }

      return element;
    });
  } catch (err) {
    if (fail) {
      throw err;
    } else {
      isImplementation = false;
    }
  }

  return isImplementation === null ? true : isImplementation;
}

export function isServiceImplementation(
  service: ServiceUnion
): service is ServiceImplementation {
  return (
    containsKey(service, 'resolve') &&
    typeof (service as any).resolve === 'function'
  );
}

export function isChildrenImplementation(
  children: ChildrenUnion,
  fail?: boolean
): children is ChildrenImplementation {
  return isTreeImplementation(
    { kind: 'scope', scopes: {}, services: children.services },
    fail
  );
}
