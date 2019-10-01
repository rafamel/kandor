import {
  TreeTypes,
  TreeServices,
  ScopeTree,
  CollectionTree,
  Envelope,
  EnvelopeElement
} from '~/types';

export function mergeCollection<
  A extends CollectionTree,
  B extends CollectionTree
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
        (acc: { [key: string]: ScopeTree }, x) =>
          Object.assign(acc, mergeScope(a.scopes[x], b.scopes[x])),
        {}
      )
    }
  } as A & B;
}

export function mergeScope<A extends ScopeTree, B extends ScopeTree>(
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
        (acc: { [key: string]: ScopeTree }, x) =>
          Object.assign(acc, mergeScope(a.scopes[x], b.scopes[x])),
        {}
      )
    }
  } as A & B;
}

export function mergeServices<A extends TreeServices, B extends TreeServices>(
  a: A,
  b: B
): A & B {
  const keys = Object.keys(b);

  for (const key of keys) {
    if (Object.hasOwnProperty.call(a, key)) {
      if (a[key].kind !== b[key].kind) {
        throw Error(
          `Forbidden override of service ${key} of kind ${a[key].kind} with kind ${b[key].kind}`
        );
      }
    }
  }

  return { ...a, ...b };
}

export function mergeTypes<A extends TreeTypes, B extends TreeTypes>(
  a: A,
  b: B
): A & B {
  const keys = Object.keys(b);

  for (const key of keys) {
    if (Object.hasOwnProperty.call(a, key)) {
      if (a[key].kind !== b[key].kind) {
        throw Error(
          `Forbidden override of type ${key} of kind ${a[key].kind} with kind ${b[key].kind}`
        );
      }
    }
  }

  return { ...a, ...b };
}

export function mergeEnvelopeTypes<T extends EnvelopeElement, N extends string>(
  a: Envelope<T, N>,
  b: { types?: TreeTypes; inline?: TreeTypes }
): Envelope<T, N> {
  const envelope = { ...a };
  if (
    Object.hasOwnProperty.call(b, 'inline') &&
    b.inline &&
    Object.keys(b.inline).length
  ) {
    envelope.inline = mergeTypes(envelope.inline || {}, b.inline);
  }
  if (
    Object.hasOwnProperty.call(b, 'types') &&
    b.types &&
    Object.keys(b.types).length
  ) {
    envelope.types = mergeTypes(envelope.types || {}, b.types);
  }

  return envelope;
}
