import {
  ServiceElementImplementation,
  CollectionTreeUnion,
  CollectionTreeImplementation
} from '~/types';
import { mergeServiceErrors } from '~/helpers';
import { Observable, from } from 'rxjs';
import { isElementService, isServiceImplementation } from '~/inspect';
import { replace } from '~/transform';
import { allof } from '~/create';
import { subscribe } from 'promist';
import { getSchemas } from '~/utils';

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
  service: ServiceElementImplementation,
  collection: CollectionTreeUnion
): ServiceElementImplementation {
  const intercepts = service.intercepts;
  delete service.intercepts;
  if (!intercepts || !intercepts.length) return service;

  const intercept = allof(intercepts);
  const schemas = getSchemas(service, collection);
  const interceptFn = intercept.factory(schemas);

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
