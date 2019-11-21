import { ElementUnion, ElementItem } from '~/types';

/**
 * Returns an *Element* `element` as an `ElementItem` with `name`.
 */
export function item<N extends string, T extends ElementUnion>(
  name: N,
  element: T
): ElementItem<T, N> {
  return {
    name,
    item: element
  };
}
