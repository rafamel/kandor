import { replace } from '~/transform';
import { isTypeResponse, isElementType } from '~/inspect';
import { CollectionTreeImplementation } from '~/types';

export function removeChildren(
  collection: CollectionTreeImplementation
): CollectionTreeImplementation {
  return replace(collection, (element, info, next) => {
    element = next(element);
    if (isElementType(element) && isTypeResponse(element) && element.children) {
      const { children, ...other } = element;
      return other;
    }
    return element;
  }) as CollectionTreeImplementation;
}
