import { Element, ElementItem } from '~/types';

/**
 * Returns an *Element* `element` as an `ElementItem` with `name`.
 */
export function item<N extends string, T extends Element>(
  name: N,
  element: T
): ElementItem<T, N> {
  return {
    name,
    item: element
  };
}
