import { CollectionTreeImplementation } from '~/types';
import { Collection } from '../../Collection';
import { isElementType, isTypeResponse } from '~/inspect/is';

export function removeChildren(
  collection: Collection<CollectionTreeImplementation>
): Collection<CollectionTreeImplementation> {
  return collection.replace((element, info, next) => {
    element = next(element);
    if (isElementType(element) && isTypeResponse(element) && element.children) {
      const { children, ...other } = element;
      return other;
    }
    return element;
  });
}
