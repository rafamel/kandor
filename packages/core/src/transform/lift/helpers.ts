import {
  TreeTypesUnion,
  ServiceElementUnion,
  ServiceErrorsUnion,
  TypeElementUnion,
  InterceptImplementation,
  ErrorTypeUnion,
  Schema
} from '~/types';
import { isServiceImplementation } from '~/inspect/is';
import isequal from 'lodash.isequal';
import { LiftTransformOptions } from './types';
import { request, response } from '~/create/implement/types';
import { containsKey } from 'contains-key';

export function liftServiceTypes(
  name: string,
  service: ServiceElementUnion,
  types: { source: TreeTypesUnion; lift: TreeTypesUnion },
  options: Required<LiftTransformOptions>,
  transform: (str: string, isExplicit: boolean) => string
): ServiceElementUnion {
  service = { ...service };

  for (const kind of ['request', 'response'] as ['request', 'response']) {
    const schema = service[kind];
    if (typeof schema === 'string') {
      checkSourceType(kind, schema, types, options);
    } else {
      const pascal = name + transform('R' + kind.slice(1), false);
      liftServiceType(pascal, kind, schema, types);
      service[kind] = pascal;
    }
  }

  service.errors = liftErrors(service.errors, types, options);

  if (
    isServiceImplementation(service) &&
    service.intercepts &&
    service.intercepts.length
  ) {
    const intercepts: InterceptImplementation[] = [];
    for (const intercept of service.intercepts) {
      intercepts.push({
        ...intercept,
        errors: liftErrors(intercept.errors, types, options)
      });
    }
    service.intercepts = intercepts;
  }

  return service;
}

export function liftErrors(
  errors: ServiceErrorsUnion,
  types: { source: TreeTypesUnion; lift: TreeTypesUnion },
  options: Required<LiftTransformOptions>
): ServiceErrorsUnion {
  const result: ServiceErrorsUnion = [];
  for (const error of errors) {
    if (typeof error === 'string') {
      checkSourceType('error', error, types, options);
    } else {
      checkServiceType('error', error.item);
      liftServiceType(error.name, 'error', error.item, types);
      result.push(error.name);
    }
  }
  return result;
}

export function checkServiceType(kind: string, type: TypeElementUnion): void {
  if (type.kind !== kind) {
    throw Error(`Invalid inline type kind.`);
  }
}

export function liftServiceType(
  name: string,
  kind: 'error' | 'request' | 'response',
  data: Schema | ErrorTypeUnion,
  types: { source: TreeTypesUnion; lift: TreeTypesUnion }
): void {
  switch (kind) {
    case 'error': {
      // In the case of errors we'll check for deep equality.
      // This is specially important for intercepts, which might
      // make inline declarations repeat themselves.
      if (containsKey(types.lift, name) && !isequal(types.lift[name], data)) {
        throw Error(`Inline error name collision: ${name}`);
      }
      types.lift[name] = data as ErrorTypeUnion;
      break;
    }
    case 'request': {
      if (containsKey(types.lift, name) as boolean) {
        throw Error(`Inline request schema name collision: ${name}`);
      }
      types.lift[name] = request({ schema: data as Schema });
      break;
    }
    case 'response': {
      if (containsKey(types.lift, name) as boolean) {
        throw Error(`Inline response schema name collision: ${name}`);
      }
      types.lift[name] = response({ schema: data as Schema });
      break;
    }
    default: {
      throw Error(`Invalid kind for type: ${name}`);
    }
  }
}

export function checkSourceType(
  kind: string,
  name: string,
  types: { source: TreeTypesUnion; lift: TreeTypesUnion },
  options: Required<LiftTransformOptions>
): void {
  const skip =
    options.skipReferences &&
    (typeof options.skipReferences === 'boolean' ||
      options.skipReferences.includes(name));

  if (containsKey(types.lift, name)) {
    if (types.lift[name].kind !== kind) {
      throw Error(
        `Invalid type kind reference -expected "${kind}" but got "${types.lift[name].kind}": ${name}`
      );
    }
  } else if (!skip) {
    throw Error(`Collection lacks referenced type: ${name}`);
  }
}
