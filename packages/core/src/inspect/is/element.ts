import {
  TreeElementUnion,
  CollectionTreeUnion,
  ElementUnion,
  ServiceElementUnion,
  TypeElementUnion,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  ErrorTypeUnion,
  RequestTypeUnion,
  ResponseTypeUnion,
  ScopeTreeUnion
} from '~/types';
import { containsKey } from 'contains-key';

export function isElement(item: any): item is ElementUnion {
  return typeof item === 'object' && item !== null && containsKey(item, 'kind');
}

export function isElementTree(
  element: ElementUnion
): element is TreeElementUnion {
  return ['collection', 'scope'].includes(element.kind);
}

export function isTreeCollection(
  tree: TreeElementUnion
): tree is CollectionTreeUnion {
  return tree.kind === 'collection' && containsKey(tree, 'types');
}

export function isTreeScope(tree: TreeElementUnion): tree is ScopeTreeUnion {
  return tree.kind === 'scope';
}

export function isElementService(
  element: ElementUnion
): element is ServiceElementUnion {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isElementType(
  element: ElementUnion
): element is TypeElementUnion {
  return ['error', 'request', 'response'].includes(element.kind);
}

export function isServiceQuery(
  service: ServiceElementUnion
): service is QueryServiceUnion {
  return service.kind === 'query';
}

export function isServiceMutation(
  service: ServiceElementUnion
): service is MutationServiceUnion {
  return service.kind === 'mutation';
}

export function isServiceSubscription(
  service: ServiceElementUnion
): service is SubscriptionServiceUnion {
  return service.kind === 'subscription';
}

export function isTypeError(type: TypeElementUnion): type is ErrorTypeUnion {
  return type.kind === 'error';
}

export function isTypeRequest(
  type: TypeElementUnion
): type is RequestTypeUnion {
  return type.kind === 'request';
}

export function isTypeResponse(
  type: TypeElementUnion
): type is ResponseTypeUnion {
  return type.kind === 'response';
}
