import { ServiceUnion, CollectionTreeUnion, SchemaUnion } from '~/types';

export interface ServiceSchemas {
  request: SchemaUnion;
  response: SchemaUnion;
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

  // TODO
  // if (service.nullable) {
  //   const validate = validator.compile(response);
  //   if (!validate(null)) {
  //     response = { anyOf: [{ type: 'null' }, response] };
  //   }
  // }

  return { request, response };
}
