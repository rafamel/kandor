import { FreeItem, CollectionTree, ScopeTree } from '~/types';
import { isFreeItem } from '~/utils';

export default function select<
  T extends ScopeTree | CollectionTree,
  S extends
    | 'scopes'
    | keyof T['services']
    | (T extends CollectionTree ? keyof T['types'] : never)
>(
  item: (T extends CollectionTree ? FreeItem<T> : never) | T,
  selection: S
): S extends 'scopes'
  ? T['scopes']
  : (S extends keyof T['services']
      ? T['services'][S]
      : (T extends CollectionTree
          ? (S extends keyof T['types'] ? T['types'][S] : never)
          : never)) {
  const element = isFreeItem(item) ? item.item : item;

  switch (selection) {
    case 'scopes':
      return element.scopes as any;
    case 'query':
    case 'mutation':
    case 'subscription':
      return element.services[
        selection as 'query' | 'mutation' | 'subscription'
      ] as any;
    case 'error':
    case 'request':
    case 'response':
      if (!Object.hasOwnProperty.call(element, 'types')) {
        throw Error(`Can't select ${selection} for an object without types`);
      }
      return (element as CollectionTree).types[
        selection as 'error' | 'request' | 'response'
      ] as any;
    default:
      throw Error(`Invalid selection ${selection}`);
  }
}
