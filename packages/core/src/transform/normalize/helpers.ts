import {
  TreeTypes,
  Service,
  ServiceErrors,
  Type,
  InterceptImplementation,
  ErrorType,
  Schema
} from '~/types';
import { isServiceImplementation } from '~/inspect/is';
import isequal from 'lodash.isequal';
import { NormalizeTransformOptions } from './types';
import { request, response } from '~/create';

export function normalizeServiceTypes(
  name: string,
  service: Service,
  types: { source: TreeTypes; normal: TreeTypes },
  options: Required<NormalizeTransformOptions>,
  transform: (str: string, isExplicit: boolean) => string
): Service {
  service = { ...service };

  for (const kind of ['request', 'response'] as ['request', 'response']) {
    const schema = service[kind];
    if (typeof schema === 'string') {
      checkSourceType(kind, schema, types, options);
    } else {
      const pascal = name + transform('R' + kind.slice(1), false);
      normalizeServiceType(pascal, kind, schema, types);
      service[kind] = pascal;
    }
  }

  service.errors = normalizeErrors(service.errors, types, options);

  if (
    isServiceImplementation(service) &&
    service.intercepts &&
    service.intercepts.length
  ) {
    const intercepts: InterceptImplementation[] = [];
    for (const intercept of service.intercepts) {
      intercepts.push({
        ...intercept,
        errors: normalizeErrors(intercept.errors, types, options)
      });
    }
    service.intercepts = intercepts;
  }

  return service;
}

export function normalizeErrors(
  errors: ServiceErrors,
  types: { source: TreeTypes; normal: TreeTypes },
  options: Required<NormalizeTransformOptions>
): ServiceErrors {
  const result: ServiceErrors = {};
  for (const [key, error] of Object.entries(errors)) {
    if (!key || /[^\w]/.exec(key) || key[0] !== key[0].toUpperCase()) {
      throw Error(
        `Inline error names must start with an uppercase letter and consist entirely of word characters: ${key}`
      );
    }

    if (typeof error === 'string') {
      checkSourceType('error', error, types, options);
      if (key !== error) {
        checkServiceType('error', types.source[error]);
        normalizeServiceType(key, 'error', types.source[error], types);
        result[key] = key;
      }
    } else {
      checkServiceType('error', error);
      normalizeServiceType(key, 'error', error, types);
      result[key] = key;
    }
  }
  return result;
}

export function checkServiceType(kind: string, type: Type): void {
  if (type.kind !== kind) {
    throw Error(`Invalid inline type kind.`);
  }
}

export function normalizeServiceType(
  name: string,
  kind: 'error' | 'request' | 'response',
  data: Schema | ErrorType,
  types: { source: TreeTypes; normal: TreeTypes }
): void {
  switch (kind) {
    case 'error': {
      // In the case of errors we'll check for deep equality.
      // This is specially important for intercepts, which might
      // make inline declarations repeat themselves.
      if (
        Object.hasOwnProperty.call(types.normal, name) &&
        !isequal(types.normal[name], data)
      ) {
        throw Error(`Inline error name collision: ${name}`);
      }
      types.normal[name] = data as ErrorType;
      return;
    }
    case 'request': {
      if (Object.hasOwnProperty.call(types.normal, name)) {
        throw Error(`Inline request schema name collision: ${name}`);
      }
      types.normal[name] = request({ schema: data as Schema });
      return;
    }
    case 'response': {
      if (Object.hasOwnProperty.call(types.normal, name)) {
        throw Error(`Inline request schema name collision: ${name}`);
      }
      types.normal[name] = response({ schema: data as Schema });
      return;
    }
    default: {
      throw Error(`Invalid kind for type: ${name}`);
    }
  }
}

export function checkSourceType(
  kind: string,
  name: string,
  types: { source: TreeTypes; normal: TreeTypes },
  options: Required<NormalizeTransformOptions>
): void {
  const skip =
    options.skipReferences &&
    (typeof options.skipReferences === 'boolean' ||
      options.skipReferences.includes(name));

  if (Object.hasOwnProperty.call(types.normal, name)) {
    if (types.normal[name].kind !== kind) {
      throw Error(
        `Invalid type kind reference -expected "${kind}" but got "${types.normal[name].kind}": ${name}`
      );
    }
  } else if (!skip) {
    throw Error(`Collection lacks referenced type: ${name}`);
  }
}
