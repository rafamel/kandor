import {
  ElementUnion,
  ElementInfo,
  ChildrenUnion,
  ChildrenServicesUnion,
  TreeUnion,
  ExceptionsRecordUnion,
  SchemasRecordUnion,
  ChildrenRecordUnion,
  ServicesRecordUnion,
  ScopesRecordUnion,
  ServiceUnion,
  ServiceExceptionsUnion
} from '~/types';
import { containsKey } from 'contains-key';
import {
  isElementTree,
  isElementService,
  isTreeCollection,
  isElementChildren
} from '~/inspect/is/element';
import { ReplaceInputFn } from './index';

export function next<E extends ElementUnion>(
  element: E,
  cb: ReplaceInputFn,
  info: ElementInfo = { path: [], route: [] }
): E {
  return cb(element, info, (item) =>
    routeNext(item === undefined ? element : (item as ElementUnion), cb, info)
  ) as E;
}

export function routeNext<E extends ElementUnion>(
  element: E,
  cb: ReplaceInputFn,
  info: ElementInfo
): E {
  if (isElementTree(element)) {
    return nextTree(element, cb, info);
  } else if (isElementService(element)) {
    return nextService(element, cb, info);
  } else if (isElementChildren(element)) {
    return nextChildren(element, cb, info);
  } else {
    return element;
  }
}

export function nextTree<E extends TreeUnion>(
  tree: E,
  cb: ReplaceInputFn,
  info: ElementInfo
): E {
  if (!info.route) throw Error(`Expected route for path: ${info.path}`);

  tree = { ...tree };

  if (isTreeCollection(tree)) {
    const exceptions: ExceptionsRecordUnion = {};
    for (const [key, value] of Object.entries(tree.exceptions)) {
      const path = info.path.concat(['exceptions', key]);
      exceptions[key] = next(value, cb, { path });
    }
    tree.exceptions = exceptions;

    const schemas: SchemasRecordUnion = {};
    for (const [key, value] of Object.entries(tree.schemas)) {
      const path = info.path.concat(['schemas', key]);
      schemas[key] = next(value, cb, { path });
    }
    tree.schemas = schemas;

    const children: ChildrenRecordUnion = {};
    for (const [key, value] of Object.entries(tree.children)) {
      const path = info.path.concat(['children', key]);
      const route = info.route.concat([key]);
      children[key] = next(value, cb, { path, route });
    }
    tree.children = children;
  }

  const services: ServicesRecordUnion = {};
  for (const [key, value] of Object.entries(tree.services)) {
    const path = info.path.concat(['services', key]);
    const route = info.route.concat([key]);
    services[key] = next(value, cb, { path, route });
  }
  tree.services = services;

  if (containsKey(tree, 'scopes')) {
    const scopes: ScopesRecordUnion = {};
    for (const [key, value] of Object.entries(tree.scopes)) {
      const path = info.path.concat(['scopes', key]);
      const route = info.route.concat([key]);
      scopes[key] = next(value, cb, { path, route });
    }
    tree.scopes = scopes;
  }

  return tree;
}

export function nextService<E extends ServiceUnion>(
  service: E,
  cb: ReplaceInputFn,
  info: ElementInfo
): E {
  const exceptions: ServiceExceptionsUnion = [];

  for (const exception of service.exceptions) {
    if (typeof exception !== 'string') {
      const path = info.path.concat(['exceptions', exception.name]);
      exceptions.push({
        ...exception,
        item: next(exception.item, cb, { path })
      });
    }
  }

  return { ...service, exceptions };
}

export function nextChildren<E extends ChildrenUnion>(
  children: E,
  cb: ReplaceInputFn,
  info: ElementInfo
): E {
  if (!info.route) throw Error(`Expected route for path: ${info.path}`);

  const services: ChildrenServicesUnion = {};

  for (const [key, value] of Object.entries(children.services)) {
    const path = info.path.concat(['children', key]);
    const route = info.route.concat([key]);
    services[key] = next(value, cb, { path, route });
  }

  return { ...children, services };
}
