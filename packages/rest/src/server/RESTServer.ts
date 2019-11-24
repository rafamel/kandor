import {
  CollectionTreeDeclaration,
  CollectionTreeImplementation,
  isElementService,
  isServiceSubscription,
  Application,
  Collection
} from '@karmic/core';
import { createDefaults } from './defaults';
import { ServerRouter } from './ServerRouter';
import {
  RESTServerOptions,
  RESTServerMethod,
  RESTServerContextFn,
  RESTServerResponse
} from './types';
import mapError from './map-error';

export class RESTServer {
  public declaration: CollectionTreeDeclaration;
  private options: Required<Omit<RESTServerOptions, 'fallback'>>;
  private router: ServerRouter;
  public constructor(
    collection: CollectionTreeImplementation,
    options?: RESTServerOptions
  ) {
    this.options = Object.assign(createDefaults(), options);

    const instance = Collection.ensure(collection);
    const app = new Application(
      this.options.subscriptions
        ? instance.toUnary()
        : instance.filter(
            (element) =>
              !isElementService(element) || !isServiceSubscription(element)
          ),
      options && options.fallback ? { fallback: options.fallback } : {}
    );

    this.declaration = app.declaration;
    this.router = new ServerRouter(
      app.flatten('/'),
      app.fallback,
      this.options.crud
    );
  }
  public async request(
    method: RESTServerMethod,
    url: string,
    body?: object | null,
    context?: RESTServerContextFn
  ): Promise<RESTServerResponse> {
    method = method.toUpperCase() as RESTServerMethod;
    const resolve = this.router.route(method, url);

    try {
      const data = await resolve(
        method !== 'GET' && body ? body : {},
        context ? await context() : {}
      );
      return {
        status: 200,
        data: this.options.envelope(null, data)
      };
    } catch (err) {
      const item = mapError(err);
      const error = item
        ? item.error
        : Collection.ensure(this.declaration).error('ServerError', err, true);

      return {
        status: item ? item.status : 500,
        data: this.options.envelope(error, null)
      };
    }
  }
}
