import {
  CollectionTreeUnion,
  CollectionTreeImplementation,
  ScopesRecordUnion,
  ServicesRecordUnion,
  ChildrenUnion
} from '~/types';
import { containsKey } from 'contains-key';
import { CollectionValidateOptions } from '../definitions';
import { lift } from './lift';
import {
  isTreeCollection,
  isElementTree,
  isTreeImplementation
} from '~/inspect/is';
import { traverse } from '~/inspect/traverse';

// TODO: validate collection object (ajv)
// TODO: children services must have a request schema equal or as a subset of the type they belong to

/**
 * It will throw if a collection:
 * - Would produce conflicting schema or exception names.
 * - Contains references to non existent schemas or exceptions.
 * - Has empty exception, schema, children, service, or scope names.
 * - Has exception, schema, children, service, or scope names with non word characters.
 * - Has exception, schema, or children names starting with a lowercase letter.
 * - Has service or scope names starting with an uppercase letter.
 * - Several children elements with equal service names reference the same schema.
 * - Has a scope name equal to a service of its parent.
 * @returns `true` if a collection is a `CollectionTreeImplementation`.
 */
export function validate(
  collection: CollectionTreeUnion,
  options?: CollectionValidateOptions
): collection is CollectionTreeImplementation {
  const opts = Object.assign({ as: null, skipReferences: false }, options);

  const normal = lift(collection, opts);

  // TODO: Validate schema (ajv) here (elements are of the correct type)

  traverse(normal, (element, info, next) => {
    if (!isElementTree(element)) return;

    if (isTreeCollection(element)) validateRoot(element);
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

/**
 * Throws if a collection:
 * - Has conflicting schema and exception names.
 * - Has exception, schema, or children names with non word characters.
 * - Has exception, schema, or children names starting with a lowercase letter.
 * - Several children elements with equal service names reference the same schema.
 */
export function validateRoot(collection: CollectionTreeUnion): void {
  const exceptions = Object.keys(collection.exceptions);
  const schemas = Object.keys(collection.schemas);
  const children = Object.keys(collection.children);

  for (const name of exceptions) {
    validateWord(name, 'uppercase');
    if (containsKey(collection.schemas, name)) {
      throw Error(`A schema can't have the same name as an exception: ${name}`);
    }
  }

  for (const name of schemas) {
    validateWord(name, 'uppercase');
  }

  const references: Record<string, ChildrenUnion> = {};
  for (const name of children) {
    validateWord(name, 'uppercase');

    const element = collection.children[name];
    for (const schema of collection.children[name].schemas) {
      if (typeof schema !== 'string') {
        throw Error(`Unexpected children schema after lift`);
      }
      if (containsKey(references, schema) as boolean) {
        for (const key of Object.keys(element.services)) {
          if (containsKey(references[schema].services, key)) {
            throw Error(
              `Several children with service "${key}" reference the same schema: ${schema}`
            );
          }
        }
        references[schema].services = {
          ...references[schema].services,
          ...element.services
        };
      } else {
        references[schema] = element;
      }
    }
  }
}

/**
 * Throws if a scope:
 * - Has an empty name or contains non word characters.
 * - Has a name starting with an uppercase letter.
 * - Has a scope name equal to a service of its parent.
 */
export function validateScopes(
  scopes: ScopesRecordUnion,
  services: ServicesRecordUnion
): void {
  for (const name of Object.keys(scopes)) {
    validateWord(name, 'lowercase');
    if (containsKey(services, name)) {
      throw Error(
        `Scopes can't have a name equal to a service of its parent: ${name}`
      );
    }
  }
}

/**
 * Throws if a service:
 * - Has an empty name or contains non word characters.
 * - Has a name starting with an uppercase letter.
 */
export function validateServices(services: ServicesRecordUnion): void {
  for (const name of Object.keys(services)) {
    validateWord(name, 'lowercase');
  }
}

export function validateWord(
  str: string,
  mode: 'uppercase' | 'lowercase'
): void {
  if (!str) {
    throw Error(
      `Empty strings are not permitted as type, service, or scope names`
    );
  }
  if (/[^\w]/.exec(str)) {
    throw Error(
      `Non word characters are not allowed for type, service, or scope names: ${str}`
    );
  }
  if (mode === 'uppercase') {
    if (str[0] !== str[0].toUpperCase()) {
      throw Error(
        `Exception and schema names must start with an uppercase letter: ${str}`
      );
    }
  } else {
    if (str[0] !== str[0].toLowerCase()) {
      throw Error(
        `Children, service, and scope names names must start with a lowercase letter: ${str}`
      );
    }
  }
}
