import { FreeItem, CollectionTree } from '~/types';
import group from './group';
import { mergeTypes } from '~/utils';

export default function root<T extends CollectionTree>(
  collection: FreeItem<T>
): T {
  // Ensure there are no inline types
  const item = group(collection);
  if (item.types && item.types.inline) {
    throw Error(
      `Didn't expect to find inline types after grouping a collection`
    );
  }

  const response = {
    ...collection.item,
    types: collection.types
      ? mergeTypes(collection.item.types, collection.types)
      : collection.item.types
  };
  // TODO: verify types exist

  return response;
}
