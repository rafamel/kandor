import { ElementInfo, ServiceImplementation } from '~/types';
import { Observable } from 'rxjs';
import { ApplicationCreateOptions, ApplicationResolve } from './definitions';
import { Service } from '../Service';
import { item } from '~/utils/item';
import { Exception } from '../Exception';
import { PublicError } from '~/PublicError';

export function createDefaults(): Required<ApplicationCreateOptions> {
  return {
    validate: true,
    children: true,
    fallback: Service.query({
      exceptions: [
        item('NotFoundError', Exception.create({ label: 'ClientNotFound' }))
      ],
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
  service: ServiceImplementation,
  info: ElementInfo
): ApplicationResolve {
  return (data: any, context: any): Promise<any> | Observable<any> => {
    return service.resolve(data, context, info);
  };
}
