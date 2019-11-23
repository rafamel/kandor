/* eslint-disable no-dupe-class-members */
import { SchemaUnion, JSONSchema } from '~/types';
import { Element } from './Element';

export class Schema<T extends SchemaUnion = SchemaUnion> extends Element<T> {
  public static create(schema?: JSONSchema): Schema;
  public static create(
    additionalProperties: boolean,
    schema?: JSONSchema
  ): Schema;
  public static create(a?: JSONSchema | boolean, b?: JSONSchema): Schema {
    const hasAdditionalProperties = typeof a === 'boolean';
    const schema = (hasAdditionalProperties ? b : (a as JSONSchema)) || {};

    return new Schema({
      kind: 'schema',
      schema: hasAdditionalProperties
        ? {
            type: schema.type || 'object',
            ...schema,
            additionalProperties: a as boolean
          }
        : schema
    });
  }
  public readonly schema: T['schema'];
  public constructor(schema: T) {
    super(schema.kind);
    this.schema = schema.schema;
  }
  public element(): T {
    return {
      kind: this.kind,
      schema: this.schema
    } as T;
  }
}
