import { CollectionTreeImplementation } from '~/types';
import { Collection, CollectionInstance } from '../../Collection';

export function removeChildren(
  collection: CollectionInstance<CollectionTreeImplementation>
): CollectionInstance<CollectionTreeImplementation> {
  return new Collection({ ...collection, children: {} });
}
