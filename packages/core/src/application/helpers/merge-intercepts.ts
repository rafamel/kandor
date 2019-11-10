import {
  ServiceImplementation,
  CollectionTree,
  CollectionTreeImplementation
} from '~/types';
import { mergeServiceErrors } from '~/helpers';
import { Observable, from } from 'rxjs';
import {
  isTypeRequest,
  isTypeResponse,
  isElementService,
  isServiceImplementation
} from '~/inspect';
import { replace } from '~/transform';
import { allof } from '~/create';
import { subscribe } from 'promist';

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

  let request = service.request;
  let response = service.response;
  if (typeof request === 'string') {
    const type = collection.types[request];
    if (!isTypeRequest(type)) {
      throw Error(`Invalid type kind for service request`);
    }
    request = type.schema;
  }
  if (typeof response === 'string') {
    const type = collection.types[response];
    if (!isTypeResponse(type)) {
      throw Error(`Invalid type kind for service response`);
    }
    response = type.schema;
  }

  const intercept = allof(intercepts);
  const interceptFn = intercept.factory({ request, response });

  switch (service.kind) {
    case 'query':
    case 'mutation': {
      const resolve = service.resolve;
      return {
        ...service,
        errors: mergeServiceErrors(service.errors, intercept.errors),
        resolve(data: any, context, info): Promise<any> {
          return subscribe(
            interceptFn(
              data,
              context,
              { ...info, kind: service.kind },
              (data: any) => {
                return from(resolve.call(this, data, context, info));
              }
            )
          );
        }
      };
    }
    case 'subscription': {
      const resolve = service.resolve;
      return {
        ...service,
        errors: mergeServiceErrors(service.errors, intercept.errors),
        resolve(data: any, context, info): Observable<any> {
          return interceptFn(
            data,
            context,
            { ...info, kind: service.kind },
            (data: any) => {
              return resolve.call(this, data, context, info);
            }
          );
        }
      };
    }
    default: {
      throw Error(`Invalid kind for type`);
    }
  }
}
