import {
  TreeTypes,
  Service,
  ServiceErrors,
  Type,
  QueryService,
  SubscriptionService,
  InterceptImplementation
} from '~/types';
import { isServiceImplementation } from '~/inspect';
import isequal from 'lodash.isequal';

export function normalizeServiceTypes(
  name: string,
  service: Service,
  types: { source: TreeTypes; normal: TreeTypes },
  transform: (str: string, isExplicit: boolean) => string
): Service {
  service = { ...service, types: { ...service.types } };

  for (const kind of ['request', 'response'] as ['request', 'response']) {
    const type = service.types[kind];
    if (typeof type === 'string') {
      service.types[kind] = checkSourceType(kind, type, types, transform);
    } else {
      const pascal = name + transform('R' + kind.slice(1), false);
      normalizeServiceType(kind, pascal, type, types, transform);
      service.types[kind] = pascal;
    }
  }

  service.types.errors = normalizeErrors(
    service.types.errors,
    types,
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
        errors: normalizeErrors(intercept.errors, types, transform)
      });
    }
    service.intercepts = intercepts;
  }

  return service;
}

export function normalizeErrors(
  errors: ServiceErrors,
  types: { source: TreeTypes; normal: TreeTypes },
  transform: (str: string, isExplicit: boolean) => string
): ServiceErrors {
  const result: ServiceErrors = {};
  for (const [key, error] of Object.entries(errors)) {
    if (typeof error === 'string') {
      let id = checkSourceType('error', error, types, transform);
      if (key !== error) {
        id = transform(key, true);
        normalizeServiceType(
          'error',
          id,
          types.source[error],
          types,
          transform
        );
      }
      result[id] = id;
    } else {
      const id = transform(key, true);
      normalizeServiceType('error', id, error, types, transform);
      result[id] = id;
    }
  }
  return result;
}

export function normalizeServiceType(
  kind: string,
  name: string,
  type: Type,
  types: { source: TreeTypes; normal: TreeTypes },
  transform: (str: string, isExplicit: boolean) => string
): void {
  if (type.kind !== kind) {
    throw Error(`Invalid inline type kind: ${name}`);
  }

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
  transform: (str: string, isExplicit: boolean) => string
): string {
  const pascal = transform(name, true);
  if (
    !Object.hasOwnProperty.call(types.source, name) ||
    !Object.hasOwnProperty.call(types.normal, pascal)
  ) {
    throw Error(`Collection lacks referenced type: ${name}`);
  }
  if (types.normal[pascal].kind !== kind) {
    throw Error(`Invalid type kind reference: ${pascal}`);
  }

  return pascal;
}
