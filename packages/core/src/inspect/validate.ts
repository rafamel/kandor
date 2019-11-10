import { CollectionTree, CollectionTreeImplementation } from '~/types';
import { lift } from '~/transform/lift';
import { isTreeImplementation } from './is';

// TODO: validate collection object (ajv) + check schemas are valid
// TODO: children services must have a request schema equal or as a subset of the type they belong to
// TODO: all request types must be of type object
// TODO: verify lowercase/uppercase don't collide
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
 * - Is neither fully a implementation or not at all.
 * - Can't be lifted - see `lift`.
 * @returns `true` if a collection is a `CollectionTreeImplementation`.
 */
export function validate(
  collection: CollectionTree,
  options?: ValidateInspectOptions
): collection is CollectionTreeImplementation {
  const opts = Object.assign({ as: null, skipReferences: false }, options);

  lift(collection, opts);

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
