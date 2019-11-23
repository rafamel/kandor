import {
  ExceptionsRecordUnion,
  SchemasRecordUnion,
  ChildrenRecordUnion,
  ServicesRecordUnion,
  ScopesRecordUnion,
  AbstractCollectionTree,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
} from '~/types';
import { ScopeCollection, ExtractScope } from '../definitions';
import { containsKey } from 'contains-key';

/**
 * Returs a new collection with all of the services within the input collection in scope `name`.
 */
export function scope<
  A extends ExceptionsRecordUnion,
  B extends SchemasRecordUnion,
  C extends ChildrenRecordUnion,
  D extends ServicesRecordUnion,
  E extends ScopesRecordUnion,
  N extends string
>(
  collection: AbstractCollectionTree<
    QueryServiceUnion,
    MutationServiceUnion,
    SubscriptionServiceUnion,
    A,
    B,
    C,
    D,
    E
  >,
  name: N
): ScopeCollection<A, B, C, D, E, N> {
  return {
    ...collection,
    services: {},
    scopes: {
      [name]: {
        kind: 'scope',
        services: collection.services,
        scopes: collection.scopes
      }
    }
  } as ScopeCollection<A, B, C, D, E, N>;
}

/**
 * Given a collection with a scope `name`, returns a new collection with all of the services in the root scope of the input collection discarded, and scope `name` serving as the new collection root.
 */
export function extract<
  A extends ExceptionsRecordUnion,
  B extends SchemasRecordUnion,
  C extends ChildrenRecordUnion,
  E extends ScopesRecordUnion,
  N extends keyof E
>(
  collection: AbstractCollectionTree<
    QueryServiceUnion,
    MutationServiceUnion,
    SubscriptionServiceUnion,
    A,
    B,
    C,
    ServicesRecordUnion,
    E
  >,
  name: N & string
): ExtractScope<A, B, C, E, N> {
  if (!containsKey(collection.scopes, name)) {
    throw Error(`Collection doesn't have scope: ${name}`);
  }

  return {
    ...collection,
    ...collection.scopes[name],
    kind: 'collection'
  };
}
