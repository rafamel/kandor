import { CollectionTreeImplementation, EnvelopeCollection } from '~/types';
import { prefixInlineTypes, mergeTypes } from '~/utils';

export default function group<T extends CollectionTreeImplementation>(
  name: string,
  collection: EnvelopeCollection<T>
): EnvelopeCollection<T> {
  const { inline, ...other } = prefixInlineTypes(name, collection);

  return {
    ...other,
    types: mergeTypes(other.types || {}, inline || {})
  };
}
