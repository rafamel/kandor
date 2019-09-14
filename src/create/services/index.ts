import { CollectionTree, InputHook, InputServices } from '~/types';
import { itemToCollection } from './item-to-collection';
import { collection } from '../collection';
import { scope as createScope } from '../scope';

export function services(
  services: InputServices,
  hooks?: InputHook | InputHook[]
): CollectionTree;
export function services(
  name: string,
  services: InputServices,
  hooks?: InputHook | InputHook[]
): CollectionTree;
export function services(
  name: string,
  scope: boolean,
  services: InputServices,
  hooks?: InputHook | InputHook[]
): CollectionTree;
export function services(...args: any[]): CollectionTree {
  const hasName = typeof args[0] === 'string';
  const hasScope = typeof args[1] === 'boolean';
  const name: string = hasName ? args[0] : '';
  const scope: boolean = hasScope ? args[1] : false;
  const services: InputServices = hasScope
    ? args[2]
    : hasName
    ? args[1]
    : args[0];
  const hooks: InputHook | InputHook[] | undefined = hasScope
    ? args[3]
    : hasName
    ? args[2]
    : args[1];

  const collections: CollectionTree[] = [];
  const entries = Object.entries(services);
  for (const [key, item] of entries) {
    collections.push(itemToCollection(name, key, item));
  }

  return scope
    ? createScope(name, collection(collections, hooks))
    : collection(collections, hooks);
}
