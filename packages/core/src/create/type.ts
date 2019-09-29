import {
  InputRequest,
  InputResponse,
  InputError,
  AppErrorType,
  AppRequestType,
  AppResponseType,
  FreeItem
} from '~/types';
import { emptyTypes, mergeTypes } from '~/utils';
import camelcase from 'camelcase';

export function error<N extends string>(
  name: N,
  type: InputError
): FreeItem<AppErrorType, N> {
  return {
    name,
    kind: 'error',
    item: type
  };
}

export function request<N extends string>(
  name: N,
  type: InputRequest
): FreeItem<AppRequestType, N> {
  return {
    name,
    kind: 'request',
    item: type
  };
}

export function response<N extends string>(
  name: N,
  type: InputResponse
): FreeItem<AppResponseType> {
  const pascalName = camelcase(name, { pascalCase: true });
  let types = emptyTypes();
  const children: AppResponseType['children'] = {
    query: {},
    subscription: {}
  };

  if (type.children && type.children.length) {
    for (const child of type.children) {
      const service = { ...child.item, types: { ...child.item.types } };
      if (child.types) {
        types = mergeTypes(types, child.types);
        if (child.types.inline) {
          if (
            service.types.request &&
            Object.hasOwnProperty.call(
              child.types.inline.request,
              service.types.request
            )
          ) {
            const pascalTypeName =
              pascalName + service.types.request.replace(/-[^-]*$/, '');
            types.request[pascalTypeName] =
              child.types.inline.request[service.types.request];
            service.types.request = pascalTypeName;
          }
        }
      }
      if (child.kind !== 'query' && child.kind !== 'subscription') {
        throw Error(
          `Children services must be of kind "query" or "subscription"`
        );
      }
      children[child.kind][child.name] = service;
    }
  }

  return {
    name,
    kind: 'response',
    types: {
      ...types,
      inline: emptyTypes()
    },
    item: {
      ...type,
      children
    }
  };
}
