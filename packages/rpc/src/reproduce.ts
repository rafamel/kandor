import {
  ElementItem,
  ExceptionUnion,
  CollectionTreeUnion,
  CollectionTreeImplementation,
  Exception,
  Collection,
  isServiceQuery,
  Service,
  isServiceMutation,
  isServiceSubscription,
  Intercept,
  PublicError
} from '@karmic/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RPCClient } from './client';

export interface RPCReproduceOptions {
  proxyException: ElementItem<ExceptionUnion<'ServerGateway'>>;
}

/**
 * Creates a `CollectionTreeImplementation` from a tree definition,
 * resolving all service calls through the client.
 */
export async function reproduce(
  collection: CollectionTreeUnion | Promise<CollectionTreeUnion>,
  client: RPCClient,
  options?: RPCReproduceOptions
): Promise<CollectionTreeImplementation> {
  const opts = Object.assign(
    {
      proxyException: {
        name: 'ProxyError',
        item: new Exception({ label: 'ServerGateway' })
      }
    },
    options
  );

  const implementation = Collection.merge(
    new Collection(await collection).toImplementation((service, info) => {
      if (isServiceQuery(service)) {
        return Service.query({
          ...service,
          resolve: (data: any) => client.unary(info.route.join(':'), data)
        });
      } else if (isServiceMutation(service)) {
        return Service.mutation({
          ...service,
          resolve: (data: any) => client.unary(info.route.join(':'), data)
        });
      } else if (isServiceSubscription(service)) {
        return Service.subscription({
          ...service,
          resolve: (data: any) => client.stream(info.route.join(':'), data)
        });
      } else {
        throw Error(`Invalid service kind: ${JSON.stringify(service)}`);
      }
    }),
    Collection.exceptions({
      [opts.proxyException.name]: opts.proxyException.item
    })
  );

  return implementation.intercept(
    new Intercept({
      exceptions: implementation.reference([opts.proxyException.name]),
      factory: () => (data, context, info, next) => {
        return next(data).pipe(
          catchError((err) => {
            return throwError(
              err instanceof PublicError
                ? err
                : implementation.error(opts.proxyException.name, err, true)
            );
          })
        );
      }
    })
  );
}
