import {
  Tree,
  Type,
  Service,
  TreeTypes,
  TreeServices,
  TreeScopes,
  ScopeTree,
  ResponseTypeChildren,
  RequestType,
  ResponseType,
  ErrorType,
  QueryService,
  SubscriptionService
} from '~/types';
import { isTreeCollection, isTypeResponse } from '~/inspect';
import {
  ReplaceTransformFn,
  ReplaceTransformOptions,
  ReplaceTransformData
} from './replace';

export function replaceTree(
  element: Tree,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn,
  options: Required<ReplaceTransformOptions>
): Tree {
  let tree = cb(element, data) as Tree;
  if (options.stop && tree !== element) return tree;

  tree = { ...tree };

  if (isTreeCollection(tree)) {
    const types: TreeTypes = {};
    for (const [key, value] of Object.entries(tree.types)) {
      const path = data.path.concat(['types', key]);
      const route = data.route.concat([key]);
      types[key] = replaceType(value, { path, route }, cb, options);
    }
    tree.types = types;
  }

  const services: TreeServices = {};
  for (const [key, value] of Object.entries(tree.services)) {
    const path = data.path.concat(['services', key]);
    const route = data.route.concat([key]);
    services[key] = replaceService(value, { path, route }, cb, options);
  }
  tree.services = services;

  if (options.deep && Object.hasOwnProperty.call(tree, 'scopes')) {
    const scopes: TreeScopes = {};
    for (const [key, value] of Object.entries(tree.scopes)) {
      const path = data.path.concat(['scopes', key]);
      const route = data.route.concat([key]);
      const scope = replaceTree(value, { path, route }, cb, options);
      scopes[key] = scope as ScopeTree;
    }
    tree.scopes = scopes;
  }

  return tree;
}

export function replaceType(
  element: Type,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn,
  options: Required<ReplaceTransformOptions>
): Type {
  let type = cb(element, data) as Type;
  if (options.stop && type !== element) return type;

  if (options.children && isTypeResponse(type) && type.children) {
    type = { ...type };

    const children: ResponseTypeChildren = {};
    for (const [key, value] of Object.entries(type.children || {})) {
      const path = data.path.concat(['children', key]);
      const route = data.route.concat([key]);
      children[key] = replaceService(value, { path, route }, cb, options) as
        | QueryService
        | SubscriptionService;
    }
    type.children = children;
  }

  return type;
}

export function replaceService(
  element: Service,
  data: ReplaceTransformData,
  cb: ReplaceTransformFn,
  options: Required<ReplaceTransformOptions>
): Service {
  let service = cb(element, data) as Service;
  if (options.stop && service !== element) return service;

  if (options.inline) {
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
      service.types.request = replaceType(
        service.types.request,
        { path, route },
        cb,
        options
      ) as RequestType;
    }

    if (typeof service.types.response !== 'string') {
      const path = data.path.concat(['types', 'response']);
      const route = data.route.concat(['response']);
      service.types.response = replaceType(
        service.types.response,
        { path, route },
        cb,
        options
      ) as ResponseType;
    }
    for (const [name, error] of Object.entries(service.types.errors)) {
      if (typeof error !== 'string') {
        const path = data.path.concat(['types', 'errors', name]);
        const route = data.route.concat(['errors', name]);
        service.types.errors[name] = replaceType(
          error,
          { path, route },
          cb,
          options
        ) as ErrorType;
      }
    }
  }

  return service;
}
