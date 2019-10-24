import {
  CollectionTreeImplementation,
  QueryServiceImplementation,
  collections,
  services,
  normalize,
  application,
  UnaryApplicationResolve,
  atPath,
  toUnary
} from '@karmic/core';

export interface MergeNotFound {
  collection: CollectionTreeImplementation;
  notFound: UnaryApplicationResolve;
}

export default function mergeNotFound(
  collection: CollectionTreeImplementation,
  notFound: QueryServiceImplementation
): MergeNotFound {
  const normal = normalize(services({ notFound }), {
    skipReferences: Object.keys(collection.types)
  });
  collection = collections(collection, { ...normal, services: {} });

  return {
    collection: collection,
    notFound: atPath(
      application(toUnary(normal), { validate: false }).routes,
      ['notFound'],
      (x: any): x is UnaryApplicationResolve => typeof x === 'function'
    )
  };
}
