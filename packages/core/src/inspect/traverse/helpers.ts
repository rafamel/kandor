import { isTreeCollection } from '../is';
import { Tree, Type, Service } from '~/types';
import { TraverseInspectOptions, TraverseInspectFn } from './traverse';

export function traverseTree(
  path: string[],
  route: string[],
  tree: Tree,
  cb: TraverseInspectFn,
  options: Required<TraverseInspectOptions>
): void {
  cb(tree, path, route);

  if (isTreeCollection(tree)) {
    const typeKeys = Object.keys(tree.types);
    for (const key of typeKeys) {
      traverseType(
        path.concat(['types', key]),
        route.concat([key]),
        tree.types[key],
        cb,
        options
      );
    }
  }

  const serviceKeys = Object.keys(tree.services);
  for (const key of serviceKeys) {
    traverseService(
      path.concat(['services', key]),
      route.concat([key]),
      tree.services[key],
      cb,
      options
    );
  }

  if (options.deep && Object.hasOwnProperty.call(tree, 'scopes')) {
    const scopeNames = Object.keys(tree.scopes);
    for (const scopeName of scopeNames) {
      traverseTree(
        path.concat(['scopes', scopeName]),
        route.concat([scopeName]),
        tree.scopes[scopeName],
        cb,
        options
      );
    }
  }
}

export function traverseType(
  path: string[],
  route: string[],
  type: Type,
  cb: TraverseInspectFn,
  options: Required<TraverseInspectOptions>
): void {
  cb(type, path, route);

  if (
    options.children &&
    type.kind === 'response' &&
    Object.hasOwnProperty.call(type, 'children') &&
    type.children
  ) {
    const childrenKeys = Object.keys(type.children);
    for (const childKey of childrenKeys) {
      const child = type.children[childKey];
      traverseService(
        path.concat(['children', childKey]),
        route.concat([childKey]),
        child,
        cb,
        options
      );
    }
  }
}

export function traverseService(
  path: string[],
  route: string[],
  service: Service,
  cb: TraverseInspectFn,
  options: Required<TraverseInspectOptions>
): void {
  cb(service, path, route);

  if (options.inline) {
    if (typeof service.types.request !== 'string') {
      traverseType(
        path.concat(['types', 'request']),
        route.concat(['request']),
        service.types.request,
        cb,
        options
      );
    }
    if (typeof service.types.response !== 'string') {
      traverseType(
        path.concat(['types', 'response']),
        route.concat(['response']),
        service.types.response,
        cb,
        options
      );
    }
    for (const [name, error] of Object.entries(service.types.errors)) {
      if (typeof error !== 'string') {
        traverseType(
          path.concat(['types', 'errors', name]),
          route.concat(['errors', name]),
          error,
          cb,
          options
        );
      }
    }
  }
}
