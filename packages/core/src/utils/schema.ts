import { Schema } from '~/types';

export function schema(schema?: Schema): Schema;
export function schema(additionalProperties: boolean, schema?: Schema): Schema;

/**
 * Returns the input `schema`. If `additionalProperties` is provided as a first argument, it will also set the schema `type` to `"object"`, and its `additionalProperties` to the value provided.
 */
export function schema(a?: Schema | boolean, b?: Schema): Schema {
  const hasAdditionalProperties = typeof a === 'boolean';
  const schema = (hasAdditionalProperties ? b : (a as Schema)) || {};

  return hasAdditionalProperties
    ? {
        type: schema.type || 'object',
        ...schema,
        additionalProperties: a as boolean
      }
    : schema;
}
