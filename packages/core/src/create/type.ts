import {
  ResponseTypeImplementation,
  ErrorTypeImplementation,
  RequestTypeImplementation,
  TreeTypesImplementation,
  Envelope,
  InputErrorType,
  InputResponseType,
  InputRequestType
} from '~/types';
import { mergeTypes, prefixInlineTypes } from '~/utils';

export function error<N extends string>(
  name: N,
  error: InputErrorType
): Envelope<ErrorTypeImplementation, N> {
  return {
    name,
    item: {
      kind: 'error',
      code: error.code
    }
  };
}

export function request<N extends string>(
  name: N,
  request: InputRequestType
): Envelope<RequestTypeImplementation, N> {
  return {
    name,
    item: {
      kind: 'request',
      schema: request.schema
    }
  };
}

export function response<N extends string>(
  name: N,
  response: InputResponseType
): Envelope<ResponseTypeImplementation, N> {
  const envelope: Envelope<ResponseTypeImplementation, N> = {
    name,
    item: {
      kind: 'response',
      schema: response.schema
    }
  };

  if (response.children) {
    let inline: TreeTypesImplementation = {};
    let types: TreeTypesImplementation = {};
    envelope.item.children = {};
    for (const child of response.children) {
      if (child.inline) inline = mergeTypes(inline, child.inline);
      if (child.types) types = mergeTypes(types, child.types);
    }
    if (Object.keys(inline).length) envelope.inline = inline;
    if (Object.keys(types).length) envelope.types = types;
  }

  const { inline, ...other } = prefixInlineTypes(name, envelope);
  return {
    ...other,
    types: mergeTypes(other.types || {}, inline || {})
  };
}
