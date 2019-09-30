import {
  TreeTypes,
  Envelope,
  EnvelopeElement,
  TreeTypesImplementation,
  ServiceImplementation,
  ResponseTypeImplementation,
  CollectionTreeImplementation
} from '~/types';
import camelcase from 'camelcase';
import clone from 'lodash.clonedeep';
import traverse from './traverse';
import { mergeTypes } from './merge';

export function prefixInlineTypes<T extends EnvelopeElement, N extends string>(
  prefix: string,
  envelope: Envelope<T, N>
): Envelope<T, N> {
  if (!envelope.inline) return envelope;

  let inline: TreeTypesImplementation = {};
  const pascalPrefix = camelcase(prefix, { pascalCase: true });

  switch (envelope.item.kind) {
    case 'collection': {
      const tree = clone(envelope.item) as T & CollectionTreeImplementation;
      traverse({ tree, deep: true, children: false }, (element, path) => {
        const key = path.slice(-1)[0] || '';
        const elementEnvelope = prefixInlineTypes(prefix, {
          name: key,
          item: element,
          inline: envelope.inline
        });
        Object.assign(element, elementEnvelope.item);
        if (elementEnvelope.inline) {
          inline = mergeTypes(inline, elementEnvelope.inline);
        }
      });
      return envelope;
    }
    case 'query':
    case 'mutation':
    case 'subscription': {
      const service = clone(envelope.item) as T & ServiceImplementation;
      if (Object.hasOwnProperty.call(envelope.inline, service.types.request)) {
        const name =
          pascalPrefix + camelcase(service.types.request, { pascalCase: true });
        service.types.request = name;
        inline[name] = envelope.inline[service.types.request];
      }
      if (Object.hasOwnProperty.call(envelope.inline, service.types.response)) {
        const name =
          pascalPrefix +
          camelcase(service.types.response, { pascalCase: true });
        service.types.response = name;
        inline[name] = envelope.inline[service.types.response];
      }
      for (const error of service.types.errors) {
        if (Object.hasOwnProperty.call(envelope.inline, error)) {
          const name = pascalPrefix + camelcase(error, { pascalCase: true });
          service.types.errors = service.types.errors
            .filter((x) => x === error)
            .concat(name);
          inline[name] = envelope.inline[error];
        }
      }
      return Object.keys(inline).length
        ? { ...envelope, inline, item: service }
        : { ...envelope, item: service };
    }
    case 'error':
    case 'request': {
      return envelope;
    }
    case 'response': {
      const response = clone(envelope.item) as T & ResponseTypeImplementation;
      if (response.children) {
        const childrenKeys = Object.keys(response.children);
        for (const childKey of childrenKeys) {
          const child = response.children[childKey];
          const childEnvelope = prefixInlineTypes(prefix, {
            name: childKey,
            item: child,
            inline: envelope.inline
          });
          response.children[childKey] = childEnvelope.item;
          if (childEnvelope.inline) {
            inline = mergeTypes(inline, childEnvelope.inline);
          }
        }
      }
      return Object.keys(inline).length
        ? { ...envelope, inline, item: response }
        : { ...envelope, item: response };
    }
    default: {
      throw Error(`Invalid item kind for Envelope`);
    }
  }
}

export function prefixTypes(prefix: string, types: TreeTypes): TreeTypes {
  const pascalPrefix = camelcase(prefix, { pascalCase: true });

  const t: TreeTypes = {};
  const typeKeys = Object.keys(types);
  for (const typeKey of typeKeys) {
    t[pascalPrefix + camelcase(typeKey, { pascalCase: true })] = types[typeKey];
  }

  return t;
}
