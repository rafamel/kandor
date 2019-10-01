import {
  CollectionTreeImplementation,
  Envelope,
  EnvelopeCollection,
  ServiceImplementation,
  TypeImplementation,
  TreeTypesImplementation
} from '~/types';
import { mergeTypes, mergeEnvelopeTypes } from '~/utils';

export default function select<
  T extends CollectionTreeImplementation,
  K extends 'types' | 'services' | 'scopes'
>(
  collection: Envelope<T>,
  key: K
): K extends 'types' | 'services'
  ? { [P in keyof T[K]]: Envelope<T[K][P]> }
  : {
      [P in keyof T[K]]: EnvelopeCollection<
        CollectionTreeImplementation & Omit<T[K][P], 'kind'>
      >;
    } {
  return trunk(collection, key, {});
}

export function trunk<
  T extends CollectionTreeImplementation,
  K extends 'types' | 'services' | 'scopes'
>(
  collection: Envelope<T>,
  key: K,
  accumulated: {
    types?: TreeTypesImplementation;
    inline?: TreeTypesImplementation;
  }
): K extends 'types' | 'services'
  ? { [P in keyof T[K]]: Envelope<T[K][P]> }
  : {
      [P in keyof T[K]]: EnvelopeCollection<
        CollectionTreeImplementation & Omit<T[K][P], 'kind'>
      >;
    } {
  switch (key) {
    case 'services': {
      const types = mergeTypes(collection.types || {}, collection.item.types);
      const inline = collection.inline || {};

      return Object.entries(collection.item.services).reduce(
        (acc: any, [key, value]) =>
          Object.defineProperty(acc, key, {
            enumerable: true,
            get(): Envelope<ServiceImplementation> {
              let envelope: Envelope<ServiceImplementation> = {
                name: key,
                item: value
              };

              // Extract types the service directly depends on
              for (const k of ['request', 'response'] as [
                'request',
                'response'
              ]) {
                if (Object.hasOwnProperty.call(inline, value.types[k])) {
                  envelope.inline = mergeTypes(envelope.inline || {}, {
                    [value.types[k]]: inline[value.types[k]]
                  });
                } else if (Object.hasOwnProperty.call(types, value.types[k])) {
                  envelope.types = mergeTypes(envelope.types || {}, {
                    [value.types[k]]: types[value.types[k]]
                  });
                }
              }
              for (const error of value.types.errors) {
                if (Object.hasOwnProperty.call(inline, error)) {
                  envelope.inline = mergeTypes(envelope.inline || {}, {
                    [error]: inline[error]
                  });
                } else if (Object.hasOwnProperty.call(types, error)) {
                  envelope.types = mergeTypes(envelope.types || {}, {
                    [error]: types[error]
                  });
                }
              }

              // Extract types the extracted types depend on
              for (const k of ['inline', 'types'] as ['inline', 'types']) {
                if (Object.hasOwnProperty.call(envelope, k) && envelope[k]) {
                  envelope = Object.values(
                    trunk(
                      {
                        ...collection,
                        item: { ...collection.item, types: envelope[k] }
                      },
                      'types',
                      mergeEnvelopeTypes(envelope, accumulated)
                    )
                  ).reduce(
                    (acc, type) => mergeEnvelopeTypes(acc, type),
                    envelope
                  );
                }
              }

              return envelope;
            }
          }),
        {}
      );
    }
    case 'types': {
      return Object.entries(collection.item.types).reduce(
        (acc: any, [key, value]) =>
          Object.defineProperty(acc, key, {
            enumerable: true,
            get(): Envelope<TypeImplementation> {
              let envelope: Envelope<TypeImplementation> = {
                name: key,
                item: value
              };

              // Extract types child services depend on
              if (
                value.kind === 'response' &&
                Object.hasOwnProperty.call(value, 'children') &&
                value.children &&
                Object.keys(value.children).length
              ) {
                envelope = Object.values(
                  trunk(
                    {
                      ...collection,
                      item: { ...collection.item, services: value.children }
                    },
                    'services',
                    mergeEnvelopeTypes(envelope, accumulated)
                  )
                ).reduce(
                  (acc, service) => mergeEnvelopeTypes(acc, service),
                  envelope
                );
              }

              return envelope;
            }
          }),
        {}
      );
    }
    case 'scopes': {
      return Object.entries(collection.item.scopes).reduce(
        (acc: any, [key, value]) =>
          Object.defineProperty(acc, key, {
            enumerable: true,
            get(): EnvelopeCollection {
              let envelope: EnvelopeCollection = {
                name: 'root',
                item: {
                  ...value,
                  types: {},
                  kind: 'collection'
                }
              };

              // Extract types from scope services
              envelope = Object.values(
                trunk(
                  { ...collection, ...envelope },
                  'services',
                  mergeEnvelopeTypes(envelope, accumulated)
                )
              ).reduce(
                (acc, service) => mergeEnvelopeTypes(acc, service),
                envelope
              );

              if (!Object.keys(value.scopes).length) return envelope;

              // Extract types from children scopes
              envelope = Object.values(
                trunk(
                  { ...collection, ...envelope },
                  'scopes',
                  mergeEnvelopeTypes(envelope, accumulated)
                )
              ).reduce(
                (acc, scope) => mergeEnvelopeTypes(acc, scope),
                envelope
              );

              return envelope;
            }
          }),
        {}
      );
    }
    default: {
      throw Error(`Invalid select key ${key}`);
    }
  }
}
