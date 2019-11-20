import {
  TreeElement,
  CollectionTree,
  Element,
  ServiceElement,
  TypeElement,
  QueryService,
  MutationService,
  SubscriptionService,
  ErrorType,
  RequestType,
  ResponseType,
  ScopeTree
} from '~/types';
import { containsKey } from 'contains-key';

export function isElement(item: any): item is Element {
  return typeof item === 'object' && item !== null && containsKey(item, 'kind');
}

export function isElementTree(element: Element): element is TreeElement {
  return ['collection', 'scope'].includes(element.kind);
}

export function isTreeCollection(tree: TreeElement): tree is CollectionTree {
  return tree.kind === 'collection' && containsKey(tree, 'types');
}

export function isTreeScope(tree: TreeElement): tree is ScopeTree {
  return tree.kind === 'scope';
}

export function isElementService(element: Element): element is ServiceElement {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isElementType(element: Element): element is TypeElement {
  return ['error', 'request', 'response'].includes(element.kind);
}

export function isServiceQuery(
  service: ServiceElement
): service is QueryService {
  return service.kind === 'query';
}

export function isServiceMutation(
  service: ServiceElement
): service is MutationService {
  return service.kind === 'mutation';
}

export function isServiceSubscription(
  service: ServiceElement
): service is SubscriptionService {
  return service.kind === 'subscription';
}

export function isTypeError(type: TypeElement): type is ErrorType {
  return type.kind === 'error';
}

export function isTypeRequest(type: TypeElement): type is RequestType {
  return type.kind === 'request';
}

export function isTypeResponse(type: TypeElement): type is ResponseType {
  return type.kind === 'response';
}
