import { TreeTypes, TreeServices, CollectionTree, ScopeTree } from '~/types';

export function conflictCollection(a: CollectionTree, b: CollectionTree): void {
  const { types: aTypes, ...aOther } = a;
  const { types: bTypes, ...bOther } = b;
  conflictTypes(aTypes, bTypes);
  conflictScope(aOther, bOther);
}

export function conflictScope(a: ScopeTree, b: ScopeTree): void {
  conflictServices(a.services, b.services);

  const aScopeNames = Object.keys(a.scopes);
  for (const aScopeName of aScopeNames) {
    if (Object.hasOwnProperty.call(b, aScopeName)) {
      conflictScope(a.scopes[aScopeName], b.scopes[aScopeName]);
    }
  }
}

export function conflictTypes(a: TreeTypes, b: TreeTypes): void {
  const keys = ['error', 'request', 'response'] as [
    'error',
    'request',
    'response'
  ];

  for (const key of keys) {
    const names = Object.keys(a[key]);
    const nonUnique = names.filter((name) =>
      Object.hasOwnProperty.call(b[key], name)
    );
    if (nonUnique.length) {
      throw Error(`Duplicated ${key} type: ${nonUnique[0]}`);
    }
  }
}

export function conflictServices(a: TreeServices, b: TreeServices): void {
  const keys = ['query', 'mutation', 'subscription'] as [
    'query',
    'mutation',
    'subscription'
  ];

  for (const key of keys) {
    const names = Object.keys(a[key]);
    const nonUnique = names.filter((name) =>
      Object.hasOwnProperty.call(b[key], name)
    );
    if (nonUnique.length) {
      throw Error(`Duplicated ${key} service: ${nonUnique[0]}`);
    }
  }
}
