import { Service, CollectionTree, Schema } from '~/types';
import { isTypeRequest, isTypeResponse } from '~/inspect';

export interface ServiceSchemas {
  request: Schema;
  response: Schema;
}

export function getSchemas(
  service: Service,
  collection: CollectionTree
): ServiceSchemas {
  let request = service.request;
  let response = service.response;
  if (typeof request === 'string') {
    const type = collection.types[request];
    if (!type || !isTypeRequest(type)) {
      throw Error(`Invalid type kind for service request`);
    }
    request = type.schema;
  }
  if (typeof response === 'string') {
    const type = collection.types[response];
    if (!type || !isTypeResponse(type)) {
      throw Error(`Invalid type kind for service response`);
    }
    response = type.schema;
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
