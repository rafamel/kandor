import {
  CollectionTree,
  CollectionTreeImplementation,
  toImplementation,
  isServiceQuery,
  isServiceMutation,
  isServiceSubscription,
  query,
  mutation,
  subscription,
  error,
  intercepts,
  intercept,
  PublicError,
  CollectionError,
  collections,
  types,
  ElementItem,
  ErrorType,
  reference
} from '@karmic/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RPCClient } from './client';

export interface RPCReproduceOptions {
  proxyError: ElementItem<ErrorType<'ServerGateway'>>;
}

/**
 * Creates a `CollectionTreeImplementation` from a tree definition,
 * resolving all service calls through the client.
 */
export async function reproduce(
  collection: CollectionTree | Promise<CollectionTree>,
  client: RPCClient,
  options?: RPCReproduceOptions
): Promise<CollectionTreeImplementation> {
  const opts = Object.assign(
    {
      proxyError: {
        name: 'ProxyError',
        item: error({ label: 'ServerGateway' })
      }
    },
    options
  );

  const implementation = collections(
    toImplementation(await collection, (service, info) => {
      if (isServiceQuery(service)) {
        return query({
          ...service,
          resolve: (data: any) => client.unary(info.route.join(':'), data)
        });
      } else if (isServiceMutation(service)) {
        return mutation({
          ...service,
          resolve: (data: any) => client.unary(info.route.join(':'), data)
        });
      } else if (isServiceSubscription(service)) {
        return subscription({
          ...service,
          resolve: (data: any) => client.stream(info.route.join(':'), data)
        });
      } else {
        throw Error(`Invalid service kind: ${JSON.stringify(service)}`);
      }
    }),
    types({ [opts.proxyError.name]: opts.proxyError.item })
  );

  return intercepts(
    implementation,
    intercept({
      errors: reference(implementation, [opts.proxyError.name]),
      factory: () => (data, context, info, next) => {
        return next(data).pipe(
          catchError((err) => {
            return throwError(
              err instanceof PublicError
                ? err
                : new CollectionError(
                    implementation,
                    opts.proxyError.name,
                    err,
                    true
                  )
            );
          })
        );
      }
    })
  );
}
