import { CollectionTree } from '~/types';

export function references<K extends string>(names: K[]): { [P in K]: P };
export function references<
  T extends CollectionTree,
  K extends keyof T['types']
>(collection: T, names?: K[]): { [P in K]: P };

/**
 * Returns an object with *keys* and *values* of `names`. It is essentially a helper to be used for type safety when referencing error types on service creation.
 */
export function references(
  a: CollectionTree | string[],
  b?: string[]
): { [key: string]: string } {
  if (Array.isArray(a)) {
    const names = a as string[];
    return names.reduce(
      (acc, name) => Object.assign(acc, { [name]: name }),
      {}
    );
  } else {
    const collection = a as CollectionTree;
    const names = b;
    const keys = names
      ? names.filter((x, i, arr) => arr.indexOf(x) === i)
      : Object.keys(collection);

    return keys.reduce((acc: any, key) => {
      if (!Object.hasOwnProperty.call(collection.types, key)) {
        throw Error(`Can't reference "${key}" on collection`);
      }
      return Object.assign(acc, { [key]: key });
    }, {});
  }
}

/**
 * Returns a *string* equal to `name`. It is essentially a helper to be used for type safety when referencing request and response types on service creation.
 */
export function reference<T extends CollectionTree, K extends keyof T['types']>(
  collection: T,
  name: K
): K {
  if (!Object.hasOwnProperty.call(collection.types, name)) {
    throw Error(`Can't reference "${name}" on collection`);
  }
  return name;
}
