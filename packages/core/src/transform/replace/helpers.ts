import {
  TreeElementUnion,
  TypeElementUnion,
  ServiceElementUnion,
  TreeTypesUnion,
  TreeServicesUnion,
  TreeScopesUnion,
  ScopeTreeUnion,
  ResponseTypeChildrenUnion,
  ElementUnion,
  ElementInfo,
  ServiceErrorsUnion
} from '~/types';
import { containsKey } from 'contains-key';
import {
  isElementTree,
  isElementType,
  isElementService,
  isTreeCollection,
  isTypeResponse
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
  } else if (isElementType(element)) {
    return nextType(element, cb, info);
  } else if (isElementService(element)) {
    return nextService(element, cb, info);
  } else {
    throw Error(`Couldn't identify element kind: ${element.kind}`);
  }
}

export function nextTree<E extends TreeElementUnion>(
  tree: E,
  cb: ReplaceInputFn,
  info: ElementInfo
): E {
  tree = { ...tree };

  if (isTreeCollection(tree)) {
    const types: TreeTypesUnion = {};
    for (const [key, value] of Object.entries(tree.types)) {
      const path = info.path.concat(['types', key]);
      const route = info.route.concat([key]);
      types[key] = next(value, cb, { path, route });
    }
    tree.types = types;
  }

  const services: TreeServicesUnion = {};
  for (const [key, value] of Object.entries(tree.services)) {
    const path = info.path.concat(['services', key]);
    const route = info.route.concat([key]);
    services[key] = next(value, cb, { path, route });
  }
  tree.services = services;

  if (containsKey(tree, 'scopes')) {
    const scopes: TreeScopesUnion = {};
    for (const [key, value] of Object.entries(tree.scopes)) {
      const path = info.path.concat(['scopes', key]);
      const route = info.route.concat([key]);
      const scope = next(value, cb, { path, route });
      scopes[key] = scope as ScopeTreeUnion;
    }
    tree.scopes = scopes;
  }

  return tree;
}

export function nextType<E extends TypeElementUnion>(
  type: E,
  cb: ReplaceInputFn,
  info: ElementInfo
): E {
  if (isTypeResponse(type) && type.children) {
    const children: ResponseTypeChildrenUnion = {};
    for (const [key, value] of Object.entries(type.children || {})) {
      const path = info.path.concat(['children', key]);
      const route = info.route.concat([key]);
      children[key] = next(value, cb, { path, route });
    }
    type = { ...type, children };
  }

  return type;
}

export function nextService<E extends ServiceElementUnion>(
  service: E,
  cb: ReplaceInputFn,
  info: ElementInfo
): E {
  const errors: ServiceErrorsUnion = [];

  for (const error of service.errors) {
    if (typeof error !== 'string') {
      const path = info.path.concat(['errors', error.name]);
      const route = info.route.concat(['errors', error.name]);
      errors.push({
        ...error,
        item: next(error.item, cb, { path, route })
      });
    }
  }

  return { ...service, errors };
}
