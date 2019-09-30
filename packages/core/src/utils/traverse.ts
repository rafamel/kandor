import {
  Tree,
  Service,
  Type,
  QueryService,
  MutationService,
  SubscriptionService
} from '~/types';
import { isTreeCollection } from './is';

export default function traverse<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  options: { tree: Tree<Q, M, S>; deep: boolean; children: boolean },
  cb: (element: Service<Q, M, S> | Type<Q, S>, path: string[]) => void
): void {
  return traverseEach([], options, cb);
}

export function traverseEach<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  path: string[],
  options: { tree: Tree<Q, M, S>; deep: boolean; children: boolean },
  cb: (element: Service<Q, M, S> | Type<Q, S>, path: string[]) => void
): void {
  if (isTreeCollection(options.tree)) {
    const typeKeys = Object.keys(options.tree.types);
    for (const key of typeKeys) {
      const type = options.tree.types[key];
      cb(type, path.concat(['types', key]));
      if (
        options.children &&
        type.kind === 'response' &&
        Object.hasOwnProperty.call(type, 'children') &&
        type.children
      ) {
        const childrenKeys = Object.keys(type.children);
        for (const childKey of childrenKeys) {
          cb(
            type.children[childKey],
            path.concat(['types', key, 'children', childKey])
          );
        }
      }
    }
  }

  const serviceKeys = Object.keys(options.tree.services);
  for (const key of serviceKeys) {
    cb(options.tree.services[key] as any, path.concat(['services', key]));
  }

  if (options.deep && Object.hasOwnProperty.call(options.tree, 'scopes')) {
    const scopeNames = Object.keys(options.tree.scopes);
    for (const scopeName of scopeNames) {
      traverseEach(
        path.concat(['scopes', scopeName]),
        { ...options, tree: options.tree.scopes[scopeName] },
        cb
      );
    }
  }
}
