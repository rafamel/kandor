import { TreeServices, TreeTypes, TreeScopes } from '~/types';

/**
 * Throws if a scope:
 * - Has an empty name or contains non word characters.
 * - Has a name starting with an uppercase letter.
 * - Has a scope name equal to a service of its parent.
 */
export function validateScopes(
  scopes: TreeScopes,
  services: TreeServices
): void {
  for (const name of Object.keys(scopes)) {
    validateWord(name);
    if (name[0] !== name[0].toLowerCase()) {
      throw Error(`Service names must start with a lowercase letter: ${name}`);
    }
    if (Object.hasOwnProperty.call(services, name)) {
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
export function validateServices(services: TreeServices): void {
  for (const name of Object.keys(services)) {
    validateWord(name);
    if (name[0] !== name[0].toLowerCase()) {
      throw Error(`Service names must start with a lowercase letter: ${name}`);
    }
  }
}

/**
 * Throws if a type:
 * - Has an empty name or contains non word characters.
 * - Has a name starting with a lowercase letter.
 */
export function validateTypes(types: TreeTypes): void {
  for (const [name, type] of Object.entries(types)) {
    validateWord(name);
    if (name[0] !== name[0].toUpperCase()) {
      throw Error(`Type names must start with an uppercase letter: ${name}`);
    }
    if (type.kind !== 'error') {
      // TODO check schemas are valid
      // TODO all request types must be of type object
    }
  }
}

/**
 * Throws if a *string* is empty or contains non word characters.
 */
export function validateWord(str: string): void {
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
}
