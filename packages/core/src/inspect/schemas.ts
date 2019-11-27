import { ServiceUnion, CollectionTreeUnion, JSONSchema } from '~/types';
import { validator } from '~/utils';
import { Schema } from '~/classes/Schema';

export interface ServiceSchemas {
  request: JSONSchema;
  response: JSONSchema;
}

export function schemas(
  collection: CollectionTreeUnion,
  service: ServiceUnion
): ServiceSchemas {
  let request = service.request;
  let response = service.response;
  if (typeof request === 'string') {
    const schema = collection.schemas[request];
    request = schema;
  }
  if (typeof response === 'string') {
    const schema = collection.schemas[response];
    response = schema;
  }

  if (service.nullable) {
    const validate = validator.compile(response.schema);
    if (!validate(null)) {
      response = new Schema(null, {
        anyOf: [{ type: 'null' }, response]
      });
    }
  }

  return { request: request.schema, response: response.schema };
}
