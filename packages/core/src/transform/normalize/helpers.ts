import {
  TreeTypes,
  Service,
  ServiceErrors,
  Type,
  QueryService,
  SubscriptionService,
  InterceptImplementation,
  ErrorType
} from '~/types';
import { isServiceImplementation } from '~/inspect/is';
import isequal from 'lodash.isequal';
import { NormalizeTransformOptions } from './types';

export function normalizeServiceTypes(
  name: string,
  service: Service,
  types: { source: TreeTypes; normal: TreeTypes },
  options: Required<NormalizeTransformOptions>,
  transform: (str: string, isExplicit: boolean) => string
): Service {
  service = { ...service, types: { ...service.types } } as Service;

  for (const kind of ['request', 'response'] as ['request', 'response']) {
    const type = service.types[kind];
    if (typeof type === 'string') {
      checkSourceType(kind, type, types, options);
    } else {
      checkServiceType(kind, type);
      if (options.liftInlineType(type)) {
        const pascal = name + transform('R' + kind.slice(1), false);
        normalizeServiceType(pascal, type, types, options, transform);
        service.types[kind] = pascal;
      }
    }
  }

  service.types.errors = normalizeErrors(
    service.types.errors,
    types,
    options,
    transform
  );

  if (
    isServiceImplementation(service) &&
    service.intercepts &&
    service.intercepts.length
  ) {
    const intercepts: InterceptImplementation[] = [];
    for (const intercept of service.intercepts) {
      intercepts.push({
        ...intercept,
        errors: normalizeErrors(intercept.errors, types, options, transform)
      });
    }
    service.intercepts = intercepts;
  }

  return service;
}

export function normalizeErrors(
  errors: ServiceErrors,
  types: { source: TreeTypes; normal: TreeTypes },
  options: Required<NormalizeTransformOptions>,
  transform: (str: string, isExplicit: boolean) => string
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
        if (options.liftInlineType(types.source[error])) {
          normalizeServiceType(
            key,
            types.source[error],
            types,
            options,
            transform
          );
          result[key] = key;
        } else {
          result[key] = types.source[error] as ErrorType;
        }
      }
    } else {
      checkServiceType('error', error);
      if (options.liftInlineType(error)) {
        normalizeServiceType(key, error, types, options, transform);
        result[key] = key;
      }
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
  type: Type,
  types: { source: TreeTypes; normal: TreeTypes },
  options: Required<NormalizeTransformOptions>,
  transform: (str: string, isExplicit: boolean) => string
): void {
  switch (type.kind) {
    case 'error': {
      // In the case of errors we'll check for deep equality.
      // This is specially important for intercepts, which might
      // make inline declarations repeat themselves.
      if (
        Object.hasOwnProperty.call(types.normal, name) &&
        !isequal(types.normal[name], type)
      ) {
        throw Error(`Inline type name collision: ${name}`);
      }
      types.normal[name] = type;
      return;
    }
    case 'request': {
      if (Object.hasOwnProperty.call(types.normal, name)) {
        throw Error(`Inline type name collision: ${name}`);
      }
      types.normal[name] = type;
      return;
    }
    case 'response': {
      if (Object.hasOwnProperty.call(types.normal, name)) {
        throw Error(`Inline type name collision: ${name}`);
      }
      if (!type.children) {
        types.normal[name] = type;
        return;
      }

      const item = {
        ...type,
        children: { ...type.children }
      };
      for (const [key, service] of Object.entries(type.children)) {
        item.children[key] = normalizeServiceTypes(
          name + transform(key, false),
          service,
          types,
          options,
          transform
        ) as QueryService | SubscriptionService;
      }

      types.normal[name] = item;
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
