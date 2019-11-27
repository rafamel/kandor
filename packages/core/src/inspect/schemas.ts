import { ServiceUnion, CollectionTreeUnion, JSONSchema } from '~/types';

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

  return { request: request.schema, response: response.schema };
}
