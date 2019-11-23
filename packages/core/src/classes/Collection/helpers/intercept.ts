import { CollectionTreeImplementation, InterceptImplementation } from '~/types';
import { CollectionInterceptOptions } from '../definitions';
import { replace } from '~/transform/replace';
import { isElementService, isServiceImplementation } from '~/inspect/is';

export function intercept<T extends CollectionTreeImplementation>(
  collection: T,
  intercepts: InterceptImplementation | InterceptImplementation[],
  options?: CollectionInterceptOptions
): T {
  const opts = Object.assign({ prepend: true }, options);
  const arr =
    intercepts && !Array.isArray(intercepts) ? [intercepts] : intercepts;

  return replace(collection, (element, info, next) => {
    element = next(element);

    return !isElementService(element) || !isServiceImplementation(element)
      ? element
      : {
          ...element,
          intercepts: opts.prepend
            ? arr.concat(element.intercepts || [])
            : (element.intercepts || []).concat(arr)
        };
  }) as T;
}
