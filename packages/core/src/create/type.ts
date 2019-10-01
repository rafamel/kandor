import {
  ResponseTypeImplementation,
  ErrorTypeImplementation,
  RequestTypeImplementation,
  Envelope,
  InputErrorType,
  InputResponseType,
  InputRequestType,
  ResponseTypeChildrenImplementation
} from '~/types';
import { mergeTypes, prefixInlineTypes, mergeEnvelopeTypes } from '~/utils';

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
  let envelope: Envelope<ResponseTypeImplementation, N> = {
    name,
    item: {
      kind: 'response',
      schema: response.schema
    }
  };

  if (response.children) {
    const children: ResponseTypeChildrenImplementation = {};
    envelope = response.children.reduce((acc, child) => {
      children[child.name] = child.item;
      return mergeEnvelopeTypes(acc, child);
    }, envelope);
    envelope.item.children = children;
  }

  const { inline, ...other } = prefixInlineTypes(name, envelope);
  if (inline && Object.keys(inline).length) {
    other.types = mergeTypes(other.types || {}, inline);
  }
  return other;
}
