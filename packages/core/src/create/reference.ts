import { CollectionTree } from '~/types';

export function reference<T extends CollectionTree, K extends keyof T['types']>(
  collection: T,
  name: K
): K;
export function reference<T extends CollectionTree, K extends keyof T['types']>(
  collection: T,
  name: K[]
): K[];

/**
 * Returns `name`, as a *string* or a *string array*, while ensuring
 * types with `name`s exist on `collection`.
 * A helper to be used for type safety when referencing types on service creation.
 */
export function reference(
  collection: CollectionTree,
  name: string | string[]
): string | string[] {
  const isArray = Array.isArray(name);
  const names = isArray ? (name as string[]) : [name as string];

  for (const name of names) {
    if (!Object.hasOwnProperty.call(collection.types, name)) {
      throw Error(`Can't reference "${name}" on collection`);
    }
  }

  return isArray ? names : names[0];
}
