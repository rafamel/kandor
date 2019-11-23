import { CollectionTreeUnion, ExceptionUnion } from '~/types';
import { containsKey } from 'contains-key';
import { PublicError } from '~/PublicError';

export function error<
  T extends CollectionTreeUnion,
  K extends keyof T['exceptions']
>(
  collection: T,
  id: K & string,
  source?: Error | null,
  clear?: boolean
): PublicError {
  if (!containsKey(collection.exceptions, id)) {
    throw Error(`Exception "${id}" does not exist on collection`);
  }

  const exception: ExceptionUnion = collection.exceptions[id];
  return new PublicError(
    id,
    exception.label,
    source,
    exception.description,
    clear
  );
}
