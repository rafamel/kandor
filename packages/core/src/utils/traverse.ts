import {
  Tree,
  Service,
  Type,
  QueryService,
  MutationService,
  SubscriptionService
} from '~/types';
import { isTreeCollection } from './is';

export default traverse;

function traverse<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  tree: Tree<Q, M, S>,
  cb: (element: Service<Q, M, S> | Type<Q, S>, path: string[]) => void
): void;
function traverse<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  tree: Tree<Q, M, S>,
  options: { deep?: boolean; children?: boolean; inline?: boolean },
  cb: (element: Service<Q, M, S> | Type<Q, S>, path: string[]) => void
): void;
function traverse(tree: Tree, b: any, c?: any): void {
  const options = c ? b : {};
  const cb = c || b;

  return traverseEach(
    [],
    tree,
    Object.assign({ deep: true, children: true, inline: true }, options),
    cb
  );
}

export function traverseEach(
  path: string[],
  tree: Tree,
  options: { deep: boolean; children: boolean; inline: boolean },
  cb: (element: Service | Type, path: string[]) => void
): void {
  if (isTreeCollection(tree)) {
    const typeKeys = Object.keys(tree.types);
    for (const key of typeKeys) {
      traverseType(path.concat(['types', key]), tree.types[key], options, cb);
    }
  }

  const serviceKeys = Object.keys(tree.services);
  for (const key of serviceKeys) {
    traverseService(
      path.concat(['services', key]),
      tree.services[key],
      options,
      cb
    );
  }

  if (options.deep && Object.hasOwnProperty.call(tree, 'scopes')) {
    const scopeNames = Object.keys(tree.scopes);
    for (const scopeName of scopeNames) {
      traverseEach(
        path.concat(['scopes', scopeName]),
        tree.scopes[scopeName],
        options,
        cb
      );
    }
  }
}

export function traverseType(
  path: string[],
  type: Type,
  options: { deep: boolean; children: boolean; inline: boolean },
  cb: (element: Service | Type, path: string[]) => void
): void {
  cb(type, path);

  if (
    options.children &&
    type.kind === 'response' &&
    Object.hasOwnProperty.call(type, 'children') &&
    type.children
  ) {
    const childrenKeys = Object.keys(type.children);
    for (const childKey of childrenKeys) {
      const child = type.children[childKey];
      traverseService(path.concat(['children', childKey]), child, options, cb);
    }
  }
}

export function traverseService(
  path: string[],
  service: Service,
  options: { deep: boolean; children: boolean; inline: boolean },
  cb: (element: Service | Type, path: string[]) => void
): void {
  cb(service, path);

  if (options.inline) {
    if (typeof service.types.request !== 'string') {
      traverseType(
        path.concat(['types', 'request']),
        service.types.request,
        options,
        cb
      );
    }
    if (typeof service.types.response !== 'string') {
      traverseType(
        path.concat(['types', 'response']),
        service.types.response,
        options,
        cb
      );
    }
    for (const [name, error] of Object.entries(service.types.errors)) {
      if (typeof error !== 'string') {
        traverseType(
          path.concat(['types', 'errors', name]),
          error,
          options,
          cb
        );
      }
    }
  }
}
