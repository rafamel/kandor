import {
  Tree,
  Type,
  Service,
  TreeTypes,
  TreeServices,
  TreeScopes,
  ScopeTree,
  ResponseTypeChildren,
  Element,
  ElementInfo
} from '~/types';
import {
  isTreeCollection,
  isTypeResponse,
  isElementTree,
  isElementType,
  isElementService
} from '~/inspect/is/element';
import { ReplaceTransformFn } from './index';

export function next<E extends Element>(
  element: E,
  info: ElementInfo,
  cb: ReplaceTransformFn
): E {
  return cb(element, info, (item) =>
    routeNext(item === undefined ? element : (item as Element), info, cb)
  ) as E;
}

export function routeNext<E extends Element>(
  element: E,
  info: ElementInfo,
  cb: ReplaceTransformFn
): E {
  if (isElementTree(element)) {
    return nextTree(element, info, cb);
  } else if (isElementType(element)) {
    return nextType(element, info, cb);
  } else if (isElementService(element)) {
    return nextService(element, info, cb);
  } else {
    throw Error(`Couldn't identify element kind: ${element.kind}`);
  }
}

export function nextTree<E extends Tree>(
  tree: E,
  info: ElementInfo,
  cb: ReplaceTransformFn
): E {
  tree = { ...tree };

  if (isTreeCollection(tree)) {
    const types: TreeTypes = {};
    for (const [key, value] of Object.entries(tree.types)) {
      const path = info.path.concat(['types', key]);
      const route = info.route.concat([key]);
      types[key] = next(value, { path, route }, cb);
    }
    tree.types = types;
  }

  const services: TreeServices = {};
  for (const [key, value] of Object.entries(tree.services)) {
    const path = info.path.concat(['services', key]);
    const route = info.route.concat([key]);
    services[key] = next(value, { path, route }, cb);
  }
  tree.services = services;

  if (Object.hasOwnProperty.call(tree, 'scopes')) {
    const scopes: TreeScopes = {};
    for (const [key, value] of Object.entries(tree.scopes)) {
      const path = info.path.concat(['scopes', key]);
      const route = info.route.concat([key]);
      const scope = next(value, { path, route }, cb);
      scopes[key] = scope as ScopeTree;
    }
    tree.scopes = scopes;
  }

  return tree;
}

export function nextType<E extends Type>(
  type: E,
  info: ElementInfo,
  cb: ReplaceTransformFn
): E {
  if (isTypeResponse(type) && type.children) {
    const children: ResponseTypeChildren = {};
    for (const [key, value] of Object.entries(type.children || {})) {
      const path = info.path.concat(['children', key]);
      const route = info.route.concat([key]);
      children[key] = next(value, { path, route }, cb);
    }
    type = { ...type, children };
  }

  return type;
}

export function nextService<E extends Service>(
  service: E,
  info: ElementInfo,
  cb: ReplaceTransformFn
): E {
  service = {
    ...service,
    errors: {
      ...service.errors
    }
  };

  for (const [name, error] of Object.entries(service.errors)) {
    if (typeof error !== 'string') {
      const path = info.path.concat(['errors', name]);
      const route = info.route.concat(['errors', name]);
      service.errors[name] = next(error, { path, route }, cb);
    }
  }

  return service;
}
