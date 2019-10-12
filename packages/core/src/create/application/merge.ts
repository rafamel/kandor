import { TreeTypes, Service, ServiceErrors, Type } from '~/types';

export function mergeServiceTypes(
  name: string,
  service: Service,
  types: { source: TreeTypes; application: TreeTypes },
  options: {
    prefixInlineError: boolean;
    transform: (str: string, explicit: boolean) => string;
  }
): void {
  const { prefixInlineError, transform } = options;

  for (const kind of ['request', 'response'] as ['request', 'response']) {
    const type = service.types[kind];
    if (typeof type === 'string') {
      service.types[kind] = checkSourceType(kind, type, types, options);
    } else {
      const pascal = name + transform('R' + kind.slice(1), false);
      mergeServiceType(kind, pascal, type, types, options);
      service.types[kind] = pascal;
    }
  }

  const errors: ServiceErrors = {};
  for (const [key, error] of Object.entries(service.types.errors)) {
    if (typeof error === 'string') {
      let id = checkSourceType('error', error, types, options);
      if (key !== error) {
        id = (prefixInlineError ? name : '') + transform(key, true);
        mergeServiceType('error', id, types.source[error], types, options);
      }
      errors[id] = id;
    } else {
      const id = (prefixInlineError ? name : '') + transform(key, true);
      mergeServiceType('error', id, error, types, options);
      errors[id] = id;
    }
  }
  service.types.errors = errors;
}

export function mergeServiceType(
  kind: string,
  name: string,
  type: Type,
  types: { source: TreeTypes; application: TreeTypes },
  options: {
    prefixInlineError: boolean;
    transform: (str: string, explicit: boolean) => string;
  }
): void {
  if (type.kind !== kind) {
    throw Error(`Invalid inline type kind: ${name}`);
  }

  switch (type.kind) {
    case 'error':
    case 'request': {
      if (Object.hasOwnProperty.call(types.application, name)) {
        throw Error(`Inline type name collision: ${name}`);
      }
      types.application[name] = type;
      return;
    }
    case 'response': {
      if (Object.hasOwnProperty.call(types.application, name)) {
        throw Error(`Inline type name collision: ${name}`);
      }
      types.application[name] = type;

      if (type.children) {
        for (const [key, service] of Object.entries(type.children)) {
          mergeServiceTypes(
            name + options.transform(key, false),
            service,
            types,
            options
          );
        }
      }
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
  types: { source: TreeTypes; application: TreeTypes },
  options: { transform: (str: string, explicit: boolean) => string }
): string {
  const pascal = options.transform(name, true);
  if (
    !Object.hasOwnProperty.call(types.source, name) ||
    !Object.hasOwnProperty.call(types.application, pascal)
  ) {
    throw Error(`Collection lacks referenced type: ${name}`);
  }
  if (types.application[pascal].kind !== kind) {
    throw Error(`Invalid type kind reference: ${pascal}`);
  }

  return pascal;
}
