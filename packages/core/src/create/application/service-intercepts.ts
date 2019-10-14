import { Service, ServiceImplementation, TreeTypes, Type } from '~/types';
import { mergeServiceErrors } from '~/utils';
import { Observable, from } from 'rxjs';
import { allof } from '../intercepts';
import {
  isServiceImplementation,
  isTypeRequest,
  isTypeResponse
} from '~/inspect';

export default function serviceIntercepts(
  name: string,
  service: Service | ServiceImplementation,
  types: TreeTypes
): void {
  if (!isServiceImplementation(service)) return;

  const intercepts = service.intercepts;
  delete service.intercepts;
  if (!intercepts || !intercepts.length) return;

  const request: Type | undefined =
    typeof service.types.request === 'string'
      ? types[service.types.request]
      : service.types.request;
  const response: Type | undefined =
    typeof service.types.response === 'string'
      ? types[service.types.response]
      : service.types.response;
  if (
    !request ||
    !response ||
    !isTypeRequest(request) ||
    !isTypeResponse(response)
  ) {
    throw Error(`Invalid type kind for service: ${name}`);
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
      Object.assign(service, {
        types: {
          ...service.types,
          errors: mergeServiceErrors(service.types.errors, intercept.errors)
        },
        resolve(data: any, context: any): Promise<any> {
          return interceptFn(data, context, (data: any) => {
            return from(resolve.call(this, data, context));
          }).toPromise();
        }
      });
      return;
    }
    case 'subscription': {
      const resolve = service.resolve;
      Object.assign(service, {
        types: {
          ...service.types,
          errors: mergeServiceErrors(service.types.errors, intercept.errors)
        },
        resolve(data: any, context: any): Observable<any> {
          return interceptFn(data, context, (data: any) => {
            return resolve.call(this, data, context);
          });
        }
      });
      return;
    }
    default: {
      throw Error(`Invalid kind for type`);
    }
  }
}
