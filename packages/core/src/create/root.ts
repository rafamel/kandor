import { EnvelopeCollection, CollectionTreeImplementation } from '~/types';
import { mergeTypes } from '~/utils';

export default function root<T extends CollectionTreeImplementation>(
  collection: EnvelopeCollection<T>
): T {
  // TODO: verify types exist
  // TODO: check all types are used (there are no dangling types)

  return {
    ...collection.item,
    types: mergeTypes(
      mergeTypes(collection.item.types || {}, collection.types || {}),
      collection.inline || {}
    )
  };
}
