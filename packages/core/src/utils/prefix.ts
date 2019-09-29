import {
  FreeItem,
  QueryService,
  MutationService,
  SubscriptionService,
  CollectionTree
} from '~/types';
import { emptyTypes, emptyServices } from './empty';
import { mergeTypes } from './merge';
import camelcase from 'camelcase';

export function prefixCollectionInlineTypes<T extends FreeItem<CollectionTree>>(
  prefix: string,
  collection: T
): T {
  const item = {
    ...collection,
    types: mergeTypes(emptyTypes(), collection.types || emptyTypes()),
    item: {
      ...collection.item,
      services: emptyServices()
    }
  };

  const keys = ['query', 'mutation', 'subscription'] as [
    'query',
    'mutation',
    'subscription'
  ];

  for (const kind of keys) {
    const hashEntries = Object.entries(collection.item.services[kind]);
    for (const [name, value] of hashEntries) {
      const serviceItem = prefixServiceInlineTypes(prefix, {
        name,
        kind,
        item: value as any,
        types: collection.types
      });
      item.item.services[kind][name] = serviceItem.item;
      item.types = mergeTypes(item.types, serviceItem.types || emptyTypes());
    }
  }

  return item;
}

export function prefixServiceInlineTypes<
  T extends FreeItem<QueryService | MutationService | SubscriptionService>
>(prefix: string, service: T): T {
  if (!service.types || !service.types.inline) return service;

  const pascalPrefix = camelcase(prefix, { pascalCase: true });
  const item = { ...service.item, types: { ...service.item.types } };
  const types = mergeTypes(emptyTypes(), service.types || emptyTypes());

  if (
    item.types.request &&
    Object.hasOwnProperty.call(service.types.inline.request, item.types.request)
  ) {
    const pascalName = pascalPrefix + item.types.request.replace(/-[^-]*$/, '');
    types.request[pascalName] =
      service.types.inline.request[item.types.request];
    item.types.request = pascalName;
  }

  if (
    item.types.response &&
    Object.hasOwnProperty.call(
      service.types.inline.response,
      item.types.response
    )
  ) {
    const pascalName =
      pascalPrefix + item.types.response.replace(/-[^-]*$/, '');
    types.response[pascalName] =
      service.types.inline.response[item.types.response];
    item.types.response = pascalName;
  }

  if (item.types.errors && item.types.errors.length) {
    for (const error of item.types.errors) {
      if (Object.hasOwnProperty.call(service.types.inline.error, error)) {
        const pascalName = pascalPrefix + error.replace(/-[^-]*$/, '');
        types.error[pascalName] = service.types.inline.error[error];
        item.types.errors = item.types.errors.map((x) =>
          x === error ? pascalName : x
        );
      }
    }
  }

  return {
    ...service,
    item,
    types
  };
}
