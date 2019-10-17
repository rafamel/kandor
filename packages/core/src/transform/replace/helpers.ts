import {
  Tree,
  Type,
  Service,
  TreeTypes,
  TreeServices,
  TreeScopes,
  ScopeTree,
  ResponseTypeChildren,
  Element
} from '~/types';
import {
  isTreeCollection,
  isTypeResponse,
  isElementTree,
  isElementType,
  isElementService
} from '~/inspect/is/element';
import { ReplaceTransformData, ReplaceTransformFn } from './types';

export function next<E extends Element>(
  element: E,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn
): E {
  return cb(
    element,
    (item) => routeNext(item === undefined ? element : item, data, cb),
    data
  ) as E;
}

export function routeNext<E extends Element>(
  element: E,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn
): E {
  if (isElementTree(element)) {
    return nextTree(element, data, cb);
  } else if (isElementType(element)) {
    return nextType(element, data, cb);
  } else if (isElementService(element)) {
    return nextService(element, data, cb);
  } else {
    throw Error(`Couldn't identify element kind: ${element.kind}`);
  }
}

export function nextTree<E extends Tree>(
  tree: E,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn
): E {
  tree = { ...tree };

  if (isTreeCollection(tree)) {
    const types: TreeTypes = {};
    for (const [key, value] of Object.entries(tree.types)) {
      const path = data.path.concat(['types', key]);
      const route = data.route.concat([key]);
      types[key] = next(value, { path, route }, cb);
    }
    tree.types = types;
  }

  const services: TreeServices = {};
  for (const [key, value] of Object.entries(tree.services)) {
    const path = data.path.concat(['services', key]);
    const route = data.route.concat([key]);
    services[key] = next(value, { path, route }, cb);
  }
  tree.services = services;

  if (Object.hasOwnProperty.call(tree, 'scopes')) {
    const scopes: TreeScopes = {};
    for (const [key, value] of Object.entries(tree.scopes)) {
      const path = data.path.concat(['scopes', key]);
      const route = data.route.concat([key]);
      const scope = next(value, { path, route }, cb);
      scopes[key] = scope as ScopeTree;
    }
    tree.scopes = scopes;
  }

  return tree;
}

export function nextType<E extends Type>(
  type: E,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn
): E {
  if (isTypeResponse(type) && type.children) {
    const children: ResponseTypeChildren = {};
    for (const [key, value] of Object.entries(type.children || {})) {
      const path = data.path.concat(['children', key]);
      const route = data.route.concat([key]);
      children[key] = next(value, { path, route }, cb);
    }
    type = { ...type, children };
  }

  return type;
}

export function nextService<E extends Service>(
  service: E,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn
): E {
  service = {
    ...service,
    types: {
      ...service.types,
      errors: {
        ...service.types.errors
      }
    }
  };

  if (typeof service.types.request !== 'string') {
    const path = data.path.concat(['types', 'request']);
    const route = data.route.concat(['request']);
    service.types.request = next(service.types.request, { path, route }, cb);
  }

  if (typeof service.types.response !== 'string') {
    const path = data.path.concat(['types', 'response']);
    const route = data.route.concat(['response']);
    service.types.response = next(service.types.response, { path, route }, cb);
  }
  for (const [name, error] of Object.entries(service.types.errors)) {
    if (typeof error !== 'string') {
      const path = data.path.concat(['types', 'errors', name]);
      const route = data.route.concat(['errors', name]);
      service.types.errors[name] = next(error, { path, route }, cb);
    }
  }

  return service;
}
