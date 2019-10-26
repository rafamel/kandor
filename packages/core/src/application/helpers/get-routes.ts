import {
  CollectionTreeImplementation,
  ApplicationRoutes,
  ServiceImplementation
} from '~/types';
import { replace } from '~/transform';
import {
  isElementService,
  isElementType,
  isTypeResponse,
  isElementTree
} from '~/inspect';
import { ApplicationCreateMapFn } from '../types';

export function getRoutes(
  collection: CollectionTreeImplementation,
  map: ApplicationCreateMapFn
): ApplicationRoutes {
  const responses: ApplicationRoutes = {};
  const routes: any = replace(collection, (element, info, next): any => {
    if (isElementService(element)) {
      return map(element as ServiceImplementation, info);
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
        children[key] = map(service as ServiceImplementation, {
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
