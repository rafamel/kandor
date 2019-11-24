import { CollectionTreeUnion } from '~/types';
import { containsKey } from 'contains-key';

export function reference<
  C extends CollectionTreeUnion,
  N extends
    | keyof C['exceptions']
    | keyof C['schemas']
    | Array<keyof C['exceptions'] | keyof C['schemas']>
>(collection: C, names: N): N extends string[] ? string[] : string;
export function reference<
  C extends CollectionTreeUnion,
  M extends 'exceptions' | 'schemas',
  N extends keyof C[M] | Array<keyof C[M]>
>(collection: C, mode: M, names: N): N extends string[] ? string[] : string;

/**
 * Returns `name`, as a *string* or a *string array*, while ensuring
 * types with `name`s exist on `collection`.
 * A helper to be used for type safety when referencing types on service creation.
 */
export function reference(
  collection: CollectionTreeUnion,
  a: string | string[],
  b?: string
): string | string[] {
  const hasMode = typeof b === 'string';
  const modes = (hasMode ? [a] : ['exceptions', 'schemas']) as Array<
    'exceptions' | 'schemas'
  >;
  const names = (hasMode ? b : a) as string | string[];

  const isArray = Array.isArray(names);
  const arr = (isArray ? names : [names]) as string[];

  for (const name of arr) {
    let found = false;
    for (const mode of modes) {
      if (containsKey(collection[mode], name)) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw Error(`Can't reference "${name}" on collection`);
    }
  }

  return isArray ? arr : arr[0];
}
