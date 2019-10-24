import { Request } from 'express';
import { CrudServices } from '@karmic/core';

export type RouterMethod = 'post' | 'get' | 'put' | 'patch' | 'delete';

export interface ParseServiceResponse {
  method: RouterMethod;
  url: string;
  map: (req: Request) => object;
}

const parsers: {
  [P in keyof Required<CrudServices>]: (
    route: string[],
    isQuery: boolean
  ) => ParseServiceResponse;
} = {
  get(route, isQuery) {
    if (!isQuery) throw Error(`CRUD service "get" can't be a mutation`);
    return {
      method: 'get',
      url: '/' + route.join('/') + '/:id',
      map: (req) => ({ ...req.query, id: req.params.id })
    };
  },
  list(route, isQuery) {
    if (!isQuery) throw Error(`CRUD service "list" can't be a mutation`);
    return {
      method: 'get',
      url: '/' + route.join('/'),
      map: (req) => req.query
    };
  },
  create(route, isQuery) {
    if (isQuery) throw Error(`CRUD service "create" must be a mutation`);
    return {
      method: 'post',
      url: '/' + route.join('/'),
      map: (req) => req.body
    };
  },
  update(route, isQuery) {
    if (isQuery) throw Error(`CRUD service "update" must be a mutation`);
    return {
      method: 'put',
      url: '/' + route.join('/') + '/:id',
      map: (req) => ({ ...req.body, id: req.params.id })
    };
  },
  patch(route, isQuery) {
    if (!isQuery) throw Error(`CRUD service "patch" must be a mutation`);
    return {
      method: 'patch',
      url: '/' + route.join('/') + '/:id',
      map: (req) => ({ ...req.body, id: req.params.id })
    };
  },
  remove(route, isQuery) {
    if (!isQuery) throw Error(`CRUD service "remove" must be a mutation`);
    return {
      method: 'delete',
      url: '/' + route.join('/') + '/:id',
      map: (req) => ({ ...req.body, id: req.params.id })
    };
  }
};

export default function parseService(
  route: string[],
  toCrud: boolean,
  isQuery: boolean
): ParseServiceResponse {
  const name = route[route.length - 1];
  if (!toCrud || !Object.hasOwnProperty.call(parsers, name)) {
    return {
      method: isQuery ? 'get' : 'post',
      url: '/' + route.join('/'),
      map: isQuery ? (req) => req.query : (req) => req.body
    };
  }

  return (parsers as any)[name](route.slice(0, -1), isQuery);
}
