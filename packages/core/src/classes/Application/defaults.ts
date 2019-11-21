import { PublicError } from '~/errors';
import { ServiceElementImplementation, ElementInfo } from '~/types';
import { Observable } from 'rxjs';
import { ApplicationCreateOptions, ApplicationResolve } from './definitions';
import { Type } from '../Type';
import { Service } from '../Service';
import { item } from '~/utils/item';

export function createDefaults(): Required<ApplicationCreateOptions> {
  return {
    validate: true,
    children: true,
    fallback: Service.query({
      errors: [item('NotFoundError', Type.error({ label: 'ClientNotFound' }))],
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
