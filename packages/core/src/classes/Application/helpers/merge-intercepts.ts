import {
  ServiceElementImplementation,
  CollectionTreeUnion,
  CollectionTreeImplementation
} from '~/types';
import { Observable, from } from 'rxjs';
import { subscribe } from 'promist';
import { isElementService, isServiceImplementation } from '~/inspect/is';
import { schemas } from '~/inspect/schemas';
import { mergeServiceErrors } from '~/transform/merge';
import { Collection } from '../../Collection';
import { Intercept } from '../../Intercept';

export function mergeIntercepts(
  collection: Collection<CollectionTreeImplementation>
): Collection<CollectionTreeImplementation> {
  return collection.replace((element, info, next) => {
    element = next(element);
    return isElementService(element) && isServiceImplementation(element)
      ? serviceIntercepts(element, collection)
      : element;
  });
}

export function serviceIntercepts(
  service: ServiceElementImplementation,
  collection: CollectionTreeUnion
): ServiceElementImplementation {
  const intercepts = service.intercepts;
  delete service.intercepts;
  if (!intercepts || !intercepts.length) return service;

  const intercept = Intercept.allOf(intercepts);
  const interceptFn = intercept.factory(schemas(service, collection));

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
