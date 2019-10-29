import {
  CollectionTreeDeclaration,
  CollectionTreeImplementation,
  application,
  toUnary,
  filter,
  isElementService,
  isServiceSubscription,
  CollectionError
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
  private options: Required<Omit<RESTServerOptions, 'default'>>;
  private router: ServerRouter;
  public constructor(
    collection: CollectionTreeImplementation,
    options?: RESTServerOptions
  ) {
    this.options = Object.assign(createDefaults(), options);
    const app = application(
      this.options.subscriptions
        ? toUnary(collection)
        : filter(
            collection,
            (element) =>
              !isElementService(element) || !isServiceSubscription(element)
          ),
      options && options.default ? { default: options.default } : {}
    );

    this.router = new ServerRouter(
      app.flatten('/'),
      app.default,
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
        : new CollectionError(this.declaration, 'ServerError', err, true);

      return {
        status: item ? item.status : 500,
        data: this.options.envelope(error, null)
      };
    }
  }
}
