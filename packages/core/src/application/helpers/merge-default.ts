import {
  CollectionTreeImplementation,
  UnaryApplicationResolve,
  QueryServiceImplementation
} from '~/types';
import { services, collections } from '~/create';
import { normalize } from '~/transform';
import { ApplicationCreateMapFn } from '../types';
import { getRoutes } from './get-routes';
import { atPath } from '~/inspect';

export interface MergeDefault {
  collection: CollectionTreeImplementation;
  default: UnaryApplicationResolve;
}

export function mergeDefault(
  collection: CollectionTreeImplementation,
  service: QueryServiceImplementation,
  map: ApplicationCreateMapFn
): MergeDefault {
  if (service.kind !== 'query') {
    throw Error(`Default service must be a query service`);
  }

  const normal = normalize(services({ default: service }), {
    skipReferences: Object.keys(collection.types)
  });

  return {
    collection: collections(collection, {
      ...normal,
      services: {}
    }),
    default: atPath(
      getRoutes(normal, map),
      ['default'],
      (x: any): x is UnaryApplicationResolve => typeof x === 'function'
    )
  };
}
