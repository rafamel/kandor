import {
  TreeTypesUnion,
  TreeServicesUnion,
  ScopeTreeUnion,
  CollectionTreeUnion,
  ServiceErrorsUnion,
  ErrorTypeUnion,
  ElementItem
} from '~/types';
import { containsKey } from 'contains-key';

export function mergeCollection<
  A extends CollectionTreeUnion,
  B extends CollectionTreeUnion
>(a: A, b: B): A & B {
  const scopeKeys = {
    a: Object.keys(a.scopes),
    b: Object.keys(b.scopes)
  };
  const nonUniqueScopeKeys = scopeKeys.a.filter(
    (x) => scopeKeys.b.indexOf(x) !== -1
  );

  return {
    kind: 'collection',
    services: mergeServices(a.services, b.services),
    types: mergeTypes(a.types, b.types),
    scopes: {
      ...a.scopes,
      ...b.scopes,
      ...nonUniqueScopeKeys.reduce(
        (acc: { [key: string]: ScopeTreeUnion }, x) =>
          Object.assign(acc, mergeScope(a.scopes[x], b.scopes[x])),
        {}
      )
    }
  } as A & B;
}

export function mergeScope<A extends ScopeTreeUnion, B extends ScopeTreeUnion>(
  a: A,
  b: B
): A & B {
  const scopeKeys = {
    a: Object.keys(a.scopes),
    b: Object.keys(b.scopes)
  };
  const nonUniqueScopeKeys = scopeKeys.a.filter(
    (x) => scopeKeys.b.indexOf(x) !== -1
  );

  return {
    kind: 'scope',
    services: mergeServices(a.services, b.services),
    scopes: {
      ...a.scopes,
      ...b.scopes,
      ...nonUniqueScopeKeys.reduce(
        (acc: { [key: string]: ScopeTreeUnion }, x) =>
          Object.assign(acc, mergeScope(a.scopes[x], b.scopes[x])),
        {}
      )
    }
  } as A & B;
}

export function mergeServices<
  A extends TreeServicesUnion,
  B extends TreeServicesUnion
>(a: A, b: B): A & B {
  const keys = Object.keys(b);

  for (const key of keys) {
    if (containsKey(a, key)) {
      if (a[key].kind !== b[key].kind) {
        throw Error(
          `Forbidden override of service ${key} of kind ${a[key].kind} with kind ${b[key].kind}`
        );
      }
    }
  }

  return { ...a, ...b };
}

export function mergeTypes<A extends TreeTypesUnion, B extends TreeTypesUnion>(
  a: A,
  b: B
): A & B {
  const keys = Object.keys(b);

  for (const key of keys) {
    if (containsKey(a, key)) {
      if (a[key].kind !== b[key].kind) {
        throw Error(
          `Forbidden override of type ${key} of kind ${a[key].kind} with kind ${b[key].kind}`
        );
      }
    }
  }

  return { ...a, ...b };
}

export function mergeServiceErrors(
  a: ServiceErrorsUnion,
  b: ServiceErrorsUnion
): ServiceErrorsUnion {
  const hash: { [key: string]: string | ElementItem<ErrorTypeUnion> } = {};

  const errors = a.concat(b);
  for (const error of errors) {
    const name = typeof error === 'string' ? error : error.name;
    if (containsKey(hash, name) && hash[name] !== error) {
      throw Error(`Service error name collition: ${name}`);
    }
    hash[name] = error;
  }

  return Object.values(hash);
}
