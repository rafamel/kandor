import {
  TreeElementUnion,
  TreeElementImplementation,
  ServiceElementUnion,
  ServiceElementImplementation,
  TypeElementUnion,
  TypeElementImplementation
} from '~/types';
import {
  isTreeCollection,
  isElementService,
  isTypeError,
  isTypeRequest
} from './element';
import { emptyCollection } from '~/helpers';
import { traverse } from '../traverse';
import { containsKey } from 'contains-key';

export function isTreeImplementation(
  tree: TreeElementUnion,
  fail?: boolean
): tree is TreeElementImplementation {
  const collection = isTreeCollection(tree)
    ? tree
    : { ...emptyCollection(), scopes: { tree } };

  let isImplementation: null | boolean = null;
  try {
    traverse(collection, (element, info, next) => {
      next();

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
  service: ServiceElementUnion
): service is ServiceElementImplementation {
  return (
    containsKey(service, 'resolve') &&
    typeof (service as any).resolve === 'function'
  );
}

export function isTypeImplementation(
  type: TypeElementUnion
): type is TypeElementImplementation {
  return (
    isTypeError(type) ||
    isTypeRequest(type) ||
    !type.children ||
    Object.values(type.children).reduce((acc: boolean, service) => {
      return acc && isServiceImplementation(service);
    }, true)
  );
}
