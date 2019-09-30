import {
  ServiceTypes,
  TreeTypesImplementation,
  InputServiceTypes
} from '~/types';
import { isEnvelope, mergeTypes } from '~/utils';
import camelcase from 'camelcase';

export default function handleInputTypes(
  prefix: string,
  input: InputServiceTypes = {}
): {
  names: ServiceTypes;
  types?: TreeTypesImplementation;
  inline?: TreeTypesImplementation;
} {
  let { request, response, errors } = input || {};
  const pascalPrefix = camelcase(prefix, { pascalCase: true });

  let types: TreeTypesImplementation = {};
  let inline: TreeTypesImplementation = {};
  const names: ServiceTypes = { errors: [], request: '', response: '' };

  // Request
  if (!request) request = { type: 'object' };
  if (typeof request === 'string') {
    names.request = request;
  } else if (isEnvelope(request)) {
    if (request.types) types = mergeTypes(types, request.types);
    if (request.inline) inline = mergeTypes(inline, request.inline);
    types = mergeTypes(types, { [request.name]: request.item });
    names.request = request.name;
  } else {
    const name = pascalPrefix + 'Request';
    inline = mergeTypes(inline, {
      [name]: { kind: 'request', schema: request }
    });
    names.request = name;
  }

  // Response
  if (!response) response = { type: 'object' };
  if (typeof response === 'string') {
    names.response = response;
  } else if (isEnvelope(response)) {
    if (response.types) types = mergeTypes(types, response.types);
    if (response.inline) inline = mergeTypes(inline, response.inline);
    types = mergeTypes(types, { [response.name]: response.item });
    names.request = response.name;
  } else {
    const name = pascalPrefix + 'Response';
    inline = mergeTypes(inline, {
      [name]: { kind: 'response', schema: response }
    });
    names.response = name;
  }

  // Errors
  if (errors && errors.length) {
    for (const error of errors) {
      if (typeof error === 'string') {
        names.errors.push(error);
      } else if (isEnvelope(error)) {
        if (error.types) types = mergeTypes(types, error.types);
        if (error.inline) inline = mergeTypes(inline, error.inline);
        types = mergeTypes(types, { [error.name]: error.item });
        names.errors.push(error.name);
      } else {
        const name = pascalPrefix + camelcase(error.name, { pascalCase: true });
        inline = mergeTypes(inline, {
          [name]: { kind: 'error', code: error.code }
        });
        names.errors.push(name);
      }
    }
  }

  const t: {
    names: ServiceTypes;
    types?: TreeTypesImplementation;
    inline?: TreeTypesImplementation;
  } = { names };
  if (Object.keys(types).length) t.types = types;
  if (Object.keys(inline).length) t.inline = inline;
  return t;
}
