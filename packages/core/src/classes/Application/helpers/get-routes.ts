import {
  CollectionTreeImplementation,
  ServiceElementImplementation
} from '~/types';
import {
  ApplicationCreateOptionsMapFn,
  ApplicationRoutes
} from '../definitions';
import { Collection } from '../../Collection';
import {
  isElementService,
  isElementType,
  isTypeResponse,
  isElementTree
} from '~/inspect/is';

export function getRoutes(
  collection: Collection<CollectionTreeImplementation>,
  map: ApplicationCreateOptionsMapFn
): ApplicationRoutes {
  const responses: ApplicationRoutes = {};
  const routes: any = collection.replace((element, info, next): any => {
    if (isElementService(element)) {
      return map(element as ServiceElementImplementation, info);
    }
    if (isElementType(element)) {
      if (!isTypeResponse(element) || !element.children) return element;

      const entries = Object.entries(element.children);
      if (!entries.length) return element;

      if (info.route.length > 1) {
        throw Error(`Type with children not at root: ${info.path}`);
      }
      const name = info.route[info.route.length - 1];
      const children: ApplicationRoutes = {};
      for (const [key, service] of entries) {
        children[key] = map(service as ServiceElementImplementation, {
          route: info.route.concat([key]),
          path: info.path.concat(['children', key])
        });
      }
      responses[name] = { ...children };
      return element;
    }

    element = next(element);
    return isElementTree(element)
      ? { ...element.scopes, ...element.services }
      : element;
  });

  return { ...responses, ...routes };
}
