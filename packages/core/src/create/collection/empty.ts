import { CollectionTree } from '~/types';

export function emptyCollection(): CollectionTree {
  return {
    types: { error: {}, request: {}, response: {} },
    services: { query: {}, mutation: {}, subscription: {} },
    scopes: {}
  };
}
