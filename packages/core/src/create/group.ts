import { FreeItem, CollectionTree } from '~/types';
import { prefixCollectionInlineTypes } from '~/utils';

/* Declaration */
export default function group<T extends FreeItem<CollectionTree>>(
  name: string | null,
  collection: T
): T;
export default function group<T extends FreeItem<CollectionTree>>(
  collection: T
): T;

/* Implementation */
export default function group(
  a: string | null | FreeItem<CollectionTree>,
  b?: FreeItem<CollectionTree>
): FreeItem<CollectionTree> {
  const collection = b ? b : (a as FreeItem<CollectionTree>);
  const name = b ? (a as string | null) : '';

  return prefixCollectionInlineTypes(name || '', collection);
}
