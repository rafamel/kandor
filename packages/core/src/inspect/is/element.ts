import {
  CollectionTreeUnion,
  ElementUnion,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  ScopeTreeUnion,
  ServiceUnion,
  TreeUnion,
  ExceptionUnion,
  SchemaUnion,
  ChildrenUnion
} from '~/types';
import { containsKey } from 'contains-key';

export function isElement(item: any): item is ElementUnion {
  return typeof item === 'object' && item !== null && containsKey(item, 'kind');
}

export function isElementTree(element: ElementUnion): element is TreeUnion {
  return ['collection', 'scope'].includes(element.kind);
}

export function isTreeCollection(tree: TreeUnion): tree is CollectionTreeUnion {
  return tree.kind === 'collection' && containsKey(tree, 'types');
}

export function isTreeScope(tree: TreeUnion): tree is ScopeTreeUnion {
  return tree.kind === 'scope';
}

export function isElementService(
  element: ElementUnion
): element is ServiceUnion {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isServiceQuery(
  service: ServiceUnion
): service is QueryServiceUnion {
  return service.kind === 'query';
}

export function isServiceMutation(
  service: ServiceUnion
): service is MutationServiceUnion {
  return service.kind === 'mutation';
}

export function isServiceSubscription(
  service: ServiceUnion
): service is SubscriptionServiceUnion {
  return service.kind === 'subscription';
}

export function isElementException(
  element: ElementUnion
): element is ExceptionUnion {
  return element.kind === 'exception';
}

export function isElementSchema(element: ElementUnion): element is SchemaUnion {
  return element.kind === 'schema';
}

export function isElementChildren(
  element: ElementUnion
): element is ChildrenUnion {
  return element.kind === 'children';
}
