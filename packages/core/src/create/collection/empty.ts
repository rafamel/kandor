import { AppCollectionTree } from '~/types';

export function emptyCollection(): AppCollectionTree {
  return {
    types: { error: {}, request: {}, response: {} },
    services: { query: {}, mutation: {}, subscription: {} },
    scopes: {}
  };
}
