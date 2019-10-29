import {
  ApplicationServices,
  ApplicationResolve,
  isServiceQuery,
  ApplicationService,
  UnaryApplicationResolve
} from '@karmic/core';
import { RESTServerMethod } from './types';
import qs, { ParsedQuery } from 'query-string';

export interface ServerMethodHash {
  GET: ServerParamHash;
  POST: ServerParamHash;
  PUT: ServerParamHash;
  PATCH: ServerParamHash;
  DELETE: ServerParamHash;
}

export interface ServerParamHash {
  parametized: ServerRouteHash;
  nonparametized: ServerRouteHash;
}

export interface ServerRouteHash {
  [key: string]: ApplicationResolve;
}

export class ServerRouter {
  private fallback: UnaryApplicationResolve;
  private routes: ServerMethodHash;
  public constructor(
    services: ApplicationServices,
    fallback: UnaryApplicationResolve,
    crud?: boolean
  ) {
    this.fallback = fallback;
    this.routes = {
      GET: { parametized: {}, nonparametized: {} },
      POST: { parametized: {}, nonparametized: {} },
      PUT: { parametized: {}, nonparametized: {} },
      PATCH: { parametized: {}, nonparametized: {} },
      DELETE: { parametized: {}, nonparametized: {} }
    };

    for (const [route, service] of Object.entries(services)) {
      this.categorize(route, service, crud);
    }
  }
  public route(method: RESTServerMethod, url: string): ApplicationResolve {
    const parsed = qs.parseUrl(url);

    if (!url) return this.resolver(method, this.fallback, parsed.query);
    let route = parsed.url.replace(/^\//, '').replace(/\/$/, '');

    const hash = this.routes[method];
    if (!hash) return this.resolver(method, this.fallback, parsed.query);

    if (Object.hasOwnProperty.call(hash.nonparametized, route)) {
      return this.resolver(method, hash.nonparametized[route], parsed.query);
    }

    const split = route.split('/');
    route = split.slice(0, -1).join('/');
    if (Object.hasOwnProperty.call(hash.parametized, route)) {
      return this.resolver(
        method,
        hash.parametized[route],
        parsed.query,
        split[split.length - 1]
      );
    }

    return this.resolver(method, this.fallback, parsed.query);
  }
  private resolver(
    method: RESTServerMethod,
    resolve: ApplicationResolve,
    query?: ParsedQuery<string>,
    id?: string
  ): ApplicationResolve {
    // Only passes query on get
    if (method === 'GET') {
      return id
        ? (data: any, context: any) =>
            resolve(
              data ? { ...data, ...query, id } : { ...query, id },
              context
            )
        : (data: any, context: any) =>
            resolve(data ? { ...data, ...query, id } : { ...query }, context);
    }

    return id
      ? (data: any, context: any) =>
          resolve(data ? { ...data, id } : { id }, context)
      : resolve;
  }
  private categorize(
    route: string,
    service: ApplicationService,
    crud?: boolean
  ): void {
    const isQuery = isServiceQuery(service.declaration);
    if (!crud) {
      this.routes[isQuery ? 'GET' : 'POST'].nonparametized[route] =
        service.resolve;
      return;
    }

    const arr = route.split('/');
    const name = arr[arr.length - 1];
    const sliced = arr.slice(0, -1).join('/');

    switch (name) {
      case 'get': {
        if (!isQuery) throw Error(`CRUD service "get" can't be a mutation`);
        this.routes.GET.parametized[sliced] = service.resolve;
        break;
      }
      case 'list': {
        if (!isQuery) throw Error(`CRUD service "list" can't be a mutation`);
        this.routes.GET.nonparametized[sliced] = service.resolve;
        break;
      }
      case 'create': {
        if (isQuery) throw Error(`CRUD service "create" must be a mutation`);
        this.routes.POST.nonparametized[sliced] = service.resolve;
        break;
      }
      case 'update': {
        if (isQuery) throw Error(`CRUD service "update" must be a mutation`);
        this.routes.PUT.parametized[sliced] = service.resolve;
        break;
      }
      case 'patch': {
        if (!isQuery) throw Error(`CRUD service "patch" must be a mutation`);
        this.routes.PATCH.parametized[sliced] = service.resolve;
        break;
      }
      case 'remove': {
        if (!isQuery) throw Error(`CRUD service "remove" must be a mutation`);
        this.routes.DELETE.parametized[sliced] = service.resolve;
        break;
      }
      default: {
        this.routes[isQuery ? 'GET' : 'POST'].nonparametized[route] =
          service.resolve;
      }
    }
  }
}
