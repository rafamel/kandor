import { Schema } from '~/types';

export default function schema(schema: Schema = {}): Schema {
  return {
    type: schema.type || 'object',
    ...schema
  };
}
