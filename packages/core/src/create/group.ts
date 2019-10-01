import { CollectionTreeImplementation, EnvelopeCollection } from '~/types';
import { prefixInlineTypes, mergeTypes } from '~/utils';

export default function group<T extends CollectionTreeImplementation>(
  name: string,
  collection: EnvelopeCollection<T>
): EnvelopeCollection<T> {
  const { inline, ...envelope } = prefixInlineTypes(name, collection);

  if (inline && Object.keys(inline).length) {
    envelope.types = mergeTypes(envelope.types || {}, inline);
  }

  return envelope;
}
