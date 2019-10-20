import {
  SubscriptionService,
  MutationService,
  QueryService,
  AbstractCollectionTree,
  AbstractScopeTree
} from '~/types';
import { emptyCollection, emptyScope } from '~/utils';

export type ScopeCreate<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService,
  T extends AbstractCollectionTree<Q, M, S>,
  N extends string
> = AbstractCollectionTree<
  Q,
  M,
  S,
  T['types'],
  {},
  { [P in N]: AbstractScopeTree<Q, M, S, T['services'], T['scopes']> }
>;

export type ExtractCreate<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService,
  T extends AbstractCollectionTree<Q, M, S>,
  N extends keyof T['scopes']
> = AbstractCollectionTree<
  Q,
  M,
  S,
  T['types'],
  T['scopes'][N]['services'],
  T['scopes'][N]['scopes']
>;

/**
 * Given a `collection`, returs a new collection with all of the services within the input collection in scope `name`.
 */
export function scope<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService,
  T extends AbstractCollectionTree<Q, M, S>,
  N extends string
>(
  name: N,
  collection: T & AbstractCollectionTree<Q, M, S>
): ScopeCreate<Q, M, S, T, N> {
  const { kind, types, ...other } = collection;

  return {
    ...emptyCollection(),
    types,
    scopes: {
      [name]: { ...emptyScope(), ...other }
    }
  } as any;
}

/**
 * Given a collection with a scope `name`, returns a new collection with all of the services in the root scope of the input collection discarded, and scope `name` serving as the new collection root.
 */
export function extract<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService,
  T extends AbstractCollectionTree<Q, M, S>,
  N extends keyof T['scopes']
>(
  collection: T & AbstractCollectionTree<Q, M, S>,
  name: N & string
): ExtractCreate<Q, M, S, T, N> {
  if (!Object.hasOwnProperty.call(collection.scopes, name)) {
    throw Error(`Collection doesn't have scope: ${name}`);
  }

  const { types } = collection;
  const { services, scopes } = collection.scopes[name];
  return {
    ...emptyCollection(),
    types,
    services,
    scopes
  } as any;
}
