import { ApplicationCreateOptions } from './types';
import { query, error, item } from '~/create';
import { PublicError } from '~/errors';
import {
  ServiceElementImplementation,
  ElementInfo,
  ApplicationResolve
} from '~/types';
import { Observable } from 'rxjs';

export function createDefaults(): Required<ApplicationCreateOptions> {
  return {
    validate: true,
    children: true,
    fallback: query({
      errors: [item('NotFoundError', error({ label: 'ClientNotFound' }))],
      async resolve() {
        throw new PublicError(
          'NotFoundError',
          'ClientNotFound',
          null,
          null,
          true
        );
      }
    }),
    map: defaultMap
  };
}

export function defaultMap(
  service: ServiceElementImplementation,
  info: ElementInfo
): ApplicationResolve {
  return (data: any, context: any): Promise<any> | Observable<any> => {
    return service.resolve(data, context, info);
  };
}
