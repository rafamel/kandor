import { CollectionTreeImplementation, ServiceImplementation } from '~/types';
import {
  ApplicationCreateOptionsMapFn,
  ApplicationRoutes
} from '../definitions';
import { CollectionInstance } from '../../Collection';
import {
  isElementService,
  isElementTree,
  isTreeCollection
} from '~/inspect/is';

export function getRoutes(
  collection: CollectionInstance<CollectionTreeImplementation>,
  map: ApplicationCreateOptionsMapFn
): ApplicationRoutes {
  const routes: any = collection.replace(
    (element, { path, route }, next): any => {
      if (isElementService(element)) {
        if (!route) {
          throw Error(`Expected route on path: ${path}`);
        }
        return map(element as ServiceImplementation, { path, route });
      }

      element = next(element);
      if (!isElementTree(element)) return element;
      return isTreeCollection(element)
        ? {
            ...element.scopes,
            ...element.services,
            ...element.children
          }
        : {
            ...element.scopes,
            ...element.services
          };
    }
  );

  return routes;
}
