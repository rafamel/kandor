import {
  Tree,
  CollectionTree,
  Element,
  Service,
  Type,
  ServiceImplementation,
  QueryService,
  MutationService,
  SubscriptionService,
  ErrorType,
  RequestType,
  ResponseType,
  TypeImplementation,
  ScopeTree,
  TreeImplementation
} from '~/types';
import { traverse } from './traverse';
import { emptyCollection } from '~/utils';

export function isElement(item: any): item is Element {
  return (
    typeof item === 'object' &&
    item !== null &&
    Object.hasOwnProperty.call(item, 'kind')
  );
}

export function isElementTree(element: Element): element is Tree {
  return ['collection', 'scope'].includes(element.kind);
}

export function isTreeCollection(tree: Tree): tree is CollectionTree {
  return (
    tree.kind === 'collection' && Object.hasOwnProperty.call(tree, 'types')
  );
}

export function isTreeScope(tree: Tree): tree is ScopeTree {
  return tree.kind === 'scope';
}

export function isElementService(element: Element): element is Service {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isElementType(element: Element): element is Type {
  return ['error', 'request', 'response'].includes(element.kind);
}

export function isServiceQuery(service: Service): service is QueryService {
  return service.kind === 'query';
}

export function isServiceMutation(
  service: Service
): service is MutationService {
  return service.kind === 'mutation';
}

export function isServiceSubscription(
  service: Service
): service is SubscriptionService {
  return service.kind === 'subscription';
}

export function isTypeError(type: Type): type is ErrorType {
  return type.kind === 'error';
}

export function isTypeRequest(type: Type): type is RequestType {
  return type.kind === 'request';
}

export function isTypeResponse(type: Type): type is ResponseType {
  return type.kind === 'response';
}

export function isTreeImplementation(
  tree: Tree,
  fail?: boolean
): tree is TreeImplementation {
  const collection = isTreeCollection(tree)
    ? tree
    : { ...emptyCollection(), scopes: { tree } };

  let isImplementation: null | boolean = null;
  try {
    traverse(collection, (element, next) => {
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
  service: Service
): service is ServiceImplementation {
  return (
    Object.hasOwnProperty.call(service, 'resolve') &&
    typeof (service as any).resolve === 'function'
  );
}

export function isTypeImplementation(type: Type): type is TypeImplementation {
  return (
    isTypeError(type) ||
    isTypeRequest(type) ||
    !type.children ||
    Object.values(type.children).reduce((acc: boolean, service) => {
      return acc && isServiceImplementation(service);
    }, true)
  );
}
