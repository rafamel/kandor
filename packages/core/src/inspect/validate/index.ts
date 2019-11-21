import { CollectionTreeUnion, CollectionTreeImplementation } from '~/types';
import { lift } from '~/transform/lift';
import { isTreeImplementation, isElementTree, isTreeCollection } from '../is';
import { traverse } from '../traverse';
import { validateTypes, validateServices, validateScopes } from './helpers';

// TODO: validate collection object (ajv)
// TODO: children services must have a request schema equal or as a subset of the type they belong to
export interface ValidateInspectOptions {
  /**
   * If specified, it will throw if a collection is
   * neither fully a implementation or a declaration.
   * Default: `null`.
   */
  as?: 'implementation' | 'declaration' | null;
  /**
   * Doesn't check reference types do exist in a collection.
   * Default: `false`.
   */
  skipReferences?: boolean | string[];
}

/**
 * It will throw if a collection:
 * - Would produce conflicting type names upon `lift`.
 * - Contains references to non existent types.
 * - Contains services with types of the wrong kind.
 * - Has empty type, service, or scope names.
 * - Has type, service, or scope names with non word characters.
 * - Has type names starting with a lowercase letter.
 * - Has service or scope names starting with an uppercase letter.
 * - Has a scope name equal to a service of its parent.
 * @returns `true` if a collection is a `CollectionTreeImplementation`.
 */
export function validate(
  collection: CollectionTreeUnion,
  options?: ValidateInspectOptions
): collection is CollectionTreeImplementation {
  const opts = Object.assign({ as: null, skipReferences: false }, options);

  traverse(lift(collection, opts), (element, info, next) => {
    if (!isElementTree(element)) return;

    if (isTreeCollection(element)) validateTypes(element.types);
    validateServices(element.services);
    validateScopes(element.scopes, element.services);
    next();
  });

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
