import {
  CollectionTree,
  InputRequest,
  InputResponse,
  InputError
} from '~/types';
import { collection } from './collection';

export function error(name: string, type: InputError): CollectionTree {
  const tree = collection();
  tree.types.error[name] = type;
  return tree;
}

export function request(name: string, type: InputRequest): CollectionTree {
  const tree = collection();
  tree.types.request[name] = type;
  return tree;
}

export function response(name: string, type: InputResponse): CollectionTree {
  const tree = collection();
  tree.types.response[name] = {
    ...type,
    children: {
      query: (type.children && type.children.query) || {},
      subscription: (type.children && type.children.subscription) || {}
    }
  };
  return tree;
}
