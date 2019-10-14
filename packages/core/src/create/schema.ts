import { Schema } from '~/types';

/**
 * Returns the input `schema`, as a type `'object'` if it was not specified. It exists to serve as a helper to improve type inference.
 */
export function schema(schema: Schema = {}): Schema {
  return {
    type: schema.type || 'object',
    ...schema
  };
}
