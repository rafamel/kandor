import { CollectionTree, CollectionTreeImplementation } from '~/types';
import { normalize } from '~/transform/normalize';
import { routes } from '~/transform/routes';
import { isTreeImplementation } from './is';

// TODO: validate collection object (ajv) + check schemas are valid

export interface ValidateInspectOptions {
  /**
   * If specified, it will also throw if the collection is not a full implementation or solely a declaration, in each case. Default: `null`.
   */
  as?: 'implementation' | 'declaration' | null;
  /**
   * Doesn't check reference types do exist in a collection. Default: `false`.
   */
  skipReferences?: boolean | string[];
}

/**
 * It will throw if a collection:
 * - Is either fully a implementation or not at all.
 * - Contains conflicting routes.
 * - Has a scope name equal to a service of its parent.
 * - Contains references to non existent types.
 * - Contains types, services, or scopes with an empty name or with non word characters.
 * - Contains services with inline types or type references of the wrong kind.
 * - Contains services which inline type names would collide upon normalization - see `normalize`.
 * @returns `true` if a collection is a `CollectionTreeImplementation`.
 */
export function validate(
  collection: CollectionTree,
  options?: ValidateInspectOptions
): collection is CollectionTreeImplementation {
  const opts = Object.assign({ as: null, skipReferences: false }, options);

  routes(collection);
  normalize(collection, opts);

  const isImplementation = isTreeImplementation(collection, true);
  if (opts.as) {
    if (opts.as === 'implementation' && !isImplementation) {
      throw Error(`Collection is not a implementation`);
    }
    if (opts.as === 'declaration' && isImplementation) {
      throw Error(`Collection is not a declaration`);
    }
  }

  return isImplementation;
}
