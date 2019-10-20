import {
  QueryService,
  MutationService,
  SubscriptionService,
  AbstractElement
} from '~/types';
import {
  isElement,
  isElementTree,
  isTreeCollection,
  isElementType,
  isElementService,
  isTypeResponse
} from './is';

export function atPath<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService,
  R = AbstractElement<Q, M, S>
>(
  item: AbstractElement<Q, M, S> | object,
  path: string[],
  validator?: (item: any) => item is R
): R {
  const isValid = validator || isElement;
  function trunk(item: any, after: string[], before: string[]): R {
    if (!after.length) {
      if (isValid(item)) return item as R;
      throw Error(`Item is not of the expected type: ${before.join('.')}`);
    }
    const next = after[0];
    if (Object.hasOwnProperty.call(item, next)) {
      return trunk((item as any)[next], after.slice(1), before.concat(next));
    }
    throw Error(`Item doesn't have property "${next}": ${before.join('.')}`);
  }

  return trunk(item, path, []) as R;
}

export function atRoute<
  Q extends QueryService,
  M extends MutationService,
  S extends SubscriptionService,
  R = AbstractElement<Q, M, S>
>(
  collection: AbstractElement<Q, M, S>,
  route: string[],
  validator?: (item: any) => item is R
): R {
  const isValid = validator || isElement;

  function trunk(element: any, after: string[], before: string[]): R {
    if (!after.length) {
      if (isValid(element)) return element as R;
      throw Error(`Item is not of the expected type: ${before.join}`);
    }

    const next = after[0];
    if (isElement(element)) {
      if (isElementTree(element)) {
        if (isTreeCollection(element)) {
          if (Object.hasOwnProperty.call(element.types, next)) {
            return trunk(
              element.types[next],
              after.slice(1),
              before.concat(next)
            );
          }
        }
        if (Object.hasOwnProperty.call(element.services, next)) {
          return trunk(
            element.services[next],
            after.slice(1),
            before.concat(next)
          );
        }
        if (Object.hasOwnProperty.call(element.scopes, next)) {
          return trunk(
            element.scopes[next],
            after.slice(1),
            before.concat(next)
          );
        }
        throw Error(
          `Element doesn't have route "${next}": ${before.join('.')}`
        );
      }
      if (isElementService(element)) {
        if (Object.hasOwnProperty.call(element.types, next)) {
          return trunk(
            (element.types as any)[next],
            after.slice(1),
            before.concat(next)
          );
        }
        throw Error(
          `Element doesn't have route "${next}": ${before.join('.')}`
        );
      }
      if (isElementType(element)) {
        if (
          isTypeResponse(element) &&
          element.children &&
          Object.hasOwnProperty.call(element.children, next)
        ) {
          return trunk(
            element.children[next],
            after.slice(1),
            before.concat(next)
          );
        }
        throw Error(
          `Element doesn't have route "${next}": ${before.join('.')}`
        );
      }
    }

    if (Object.hasOwnProperty.call(element, next)) {
      return trunk(element[next], after.slice(1), before.concat(next));
    }

    throw Error(`Element doesn't have route "${next}": ${before.join('.')}`);
  }

  return trunk(collection, route, []) as R;
}
