import { ServiceItem, AppCollectionTree } from '~/types';
import { collection } from '../collection';
import camelcase from 'camelcase';
import { request, response, error } from '../type';

export function itemToCollection(
  prefix: string,
  name: string,
  item: ServiceItem
): AppCollectionTree {
  const collections: AppCollectionTree[] = [];
  const service = {
    ...item.service,
    types: { ...item.service.types }
  };

  const pre =
    camelcase(prefix, { pascalCase: true }) +
    camelcase(name, { pascalCase: true });
  if (item.types.request) {
    collections.push(request(pre + 'Request', { schema: item.types.request }));
    service.types.request = pre + 'Request';
  }
  if (item.types.response) {
    collections.push(
      response(pre + 'Response', { schema: item.types.response })
    );
    service.types.response = pre + 'Response';
  }
  if (item.types.errors) {
    for (const { name: id, ...other } of item.types.errors) {
      collections.push(error(pre + id, other));
      service.types.errors.push(pre + id);
    }
  }

  const tree = collection();
  tree.services[item.kind][name] = service;
  collections.push(tree);

  return collection(collections);
}
