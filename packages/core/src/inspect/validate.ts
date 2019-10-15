import { CollectionTree, CollectionTreeImplementation } from '~/types';
import { normalize } from '~/transform/normalize';
import { routes } from '~/transform/routes';
import { isTreeImplementation } from './is';

// TODO: validate collection object (ajv) + check schemas are valid

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
  collection: CollectionTree
): collection is CollectionTreeImplementation {
  routes(collection);
  normalize(collection);
  return isTreeImplementation(collection, true);
}
