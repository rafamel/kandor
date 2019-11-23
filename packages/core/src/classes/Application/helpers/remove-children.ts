import { CollectionTreeImplementation } from '~/types';
import { Collection } from '../../Collection';

export function removeChildren(
  collection: Collection<CollectionTreeImplementation>
): Collection<CollectionTreeImplementation> {
  return new Collection({ ...collection, children: {} });
}
