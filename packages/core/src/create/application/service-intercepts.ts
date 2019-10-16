import { ServiceImplementation, Type, CollectionTree } from '~/types';
import { mergeServiceErrors } from '~/utils';
import { Observable, from } from 'rxjs';
import { allof } from '../intercepts';
import { isTypeRequest, isTypeResponse } from '~/inspect';

export default function serviceIntercepts(
  service: ServiceImplementation,
  collection: CollectionTree
): ServiceImplementation {
  const intercepts = service.intercepts;
  delete service.intercepts;
  if (!intercepts || !intercepts.length) return service;

  const request: Type =
    typeof service.types.request === 'string'
      ? collection.types[service.types.request]
      : service.types.request;
  const response: Type =
    typeof service.types.response === 'string'
      ? collection.types[service.types.response]
      : service.types.response;
  if (!isTypeRequest(request) || !isTypeResponse(response)) {
    throw Error(`Invalid type kind for service`);
  }

  const intercept = allof(intercepts);
  const interceptFn = intercept.factory({
    request: request.schema,
    response: response.schema
  });

  switch (service.kind) {
    case 'query':
    case 'mutation': {
      const resolve = service.resolve;
      return {
        ...service,
        types: {
          ...service.types,
          errors: mergeServiceErrors(service.types.errors, intercept.errors)
        },
        resolve(data: any, context: any): Promise<any> {
          return interceptFn(data, context, (data: any) => {
            return from(resolve.call(this, data, context));
          }).toPromise();
        }
      };
    }
    case 'subscription': {
      const resolve = service.resolve;
      return {
        ...service,
        types: {
          ...service.types,
          errors: mergeServiceErrors(service.types.errors, intercept.errors)
        },
        resolve(data: any, context: any): Observable<any> {
          return interceptFn(data, context, (data: any) => {
            return resolve.call(this, data, context);
          });
        }
      };
    }
    default: {
      throw Error(`Invalid kind for type`);
    }
  }
}
