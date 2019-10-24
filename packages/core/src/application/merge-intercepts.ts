import {
  ServiceImplementation,
  Type,
  CollectionTree,
  CollectionTreeImplementation
} from '~/types';
import { mergeServiceErrors } from '~/utils';
import { Observable, from } from 'rxjs';
import {
  isTypeRequest,
  isTypeResponse,
  isElementService,
  isServiceImplementation
} from '~/inspect';
import { replace } from '~/transform';
import { allof } from '~/create';
import { take } from 'rxjs/operators';

export function mergeIntercepts(
  collection: CollectionTreeImplementation
): CollectionTreeImplementation {
  return replace(collection, (element, info, next) => {
    element = next(element);
    return isElementService(element) && isServiceImplementation(element)
      ? serviceIntercepts(element, collection)
      : element;
  }) as CollectionTreeImplementation;
}

export function serviceIntercepts(
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
        resolve(data: any, context, info): Promise<any> {
          return interceptFn(data, context, info, (data: any) => {
            return from(resolve.call(this, data, context, info));
          })
            .pipe(take(1))
            .toPromise();
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
        resolve(data: any, context, info): Observable<any> {
          return interceptFn(data, context, info, (data: any) => {
            return resolve.call(this, data, context, info);
          });
        }
      };
    }
    default: {
      throw Error(`Invalid kind for type`);
    }
  }
}
