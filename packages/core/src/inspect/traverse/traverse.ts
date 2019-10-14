import {
  Tree,
  QueryService,
  MutationService,
  SubscriptionService,
  Element
} from '~/types';
import { traverseTree } from './helpers';

export type TraverseInspectFn<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = (element: Element<Q, M, S>, path: string[], route: string[]) => void;

export interface TraverseInspectOptions {
  deep?: boolean;
  children?: boolean;
  inline?: boolean;
}

export function traverse<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService
>(
  tree: Tree<Q, M, S>,
  cb: TraverseInspectFn<Q, M, S>,
  options?: TraverseInspectOptions
): void {
  return traverseTree(
    [],
    [],
    tree,
    cb as any,
    Object.assign({ deep: true, children: false, inline: false }, options)
  );
}
