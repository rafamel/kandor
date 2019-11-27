import { SchemaUnion, JSONSchema } from '~/types';
import { Element } from './Element';

export type SchemaInput = Partial<SchemaUnion>;

export class Schema extends Element<SchemaUnion> {
  static ensure(schema: SchemaUnion): Schema {
    return schema instanceof Schema ? schema : new Schema(schema);
  }
  static json(
    input?: SchemaInput | boolean | null,
    schema?: JSONSchema
  ): JSONSchema {
    return new Schema(input, schema).schema;
  }
  public readonly schema: JSONSchema;
  public constructor(
    input?: SchemaInput | boolean | null,
    schema?: JSONSchema
  ) {
    super('schema');

    if (input === null || input === undefined) {
      this.schema = schema || {};
    } else if (typeof input === 'boolean') {
      this.schema = {
        type: 'object',
        additionalProperties: input,
        ...schema
      };
    } else {
      this.schema = {
        ...input.schema,
        ...schema
      };
    }
  }
  public element(): SchemaUnion {
    return {
      kind: this.kind,
      schema: this.schema
    };
  }
}
