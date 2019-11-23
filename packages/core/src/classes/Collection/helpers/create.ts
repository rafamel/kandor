import {
  ExceptionsRecordUnion,
  SchemasRecordUnion,
  ChildrenRecordUnion,
  ServicesRecordUnion,
  ScopesRecordUnion,
  CollectionTreeUnion
} from '~/types';
import { CollectionCreateInput } from '../definitions';

export function create<
  A extends ExceptionsRecordUnion = {},
  B extends SchemasRecordUnion = {},
  C extends ChildrenRecordUnion = {},
  D extends ServicesRecordUnion = {},
  E extends ScopesRecordUnion = {}
>(
  collection?: CollectionCreateInput<A, B, C, D, E>
): CollectionTreeUnion<A, B, C, D, E> {
  if (!collection) collection = {};

  return {
    kind: 'collection',
    exceptions: collection.exceptions || {},
    schemas: collection.schemas || {},
    children: collection.children || {},
    services: collection.services || {},
    scopes: collection.scopes || {}
  } as CollectionTreeUnion<A, B, C, D, E>;
}
