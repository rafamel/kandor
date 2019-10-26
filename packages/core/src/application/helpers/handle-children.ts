import { normalize, replace } from '~/transform';
import { isTypeResponse, isElementType } from '~/inspect';
import { CollectionTreeImplementation } from '~/types';

export function handleChildren(
  collection: CollectionTreeImplementation,
  mode: 'lift' | 'remove'
): CollectionTreeImplementation {
  switch (mode) {
    case 'lift': {
      return normalize(collection, {
        liftInlineType(type) {
          if (!isTypeResponse(type) || !type.children) return false;
          return Object.keys(type.children).length > 0;
        }
      });
    }
    case 'remove': {
      return replace(collection, (element, info, next) => {
        element = next(element);
        if (
          isElementType(element) &&
          isTypeResponse(element) &&
          element.children
        ) {
          const { children, ...other } = element;
          return other;
        }
        return element;
      }) as CollectionTreeImplementation;
    }
    default: {
      throw Error(`Expect "lift" or "remove" as mode: ${mode}`);
    }
  }
}
