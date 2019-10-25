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
  ErrorTypeImplementation,
  error,
  intercepts,
  intercept,
  PublicError,
  CollectionError,
  collections,
  types,
  references
} from '@karmic/core';
import RPCClient from './client';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface RPCReproduceOptions {
  proxyError: RPCReproduceProxyError;
}

export interface RPCReproduceProxyError {
  name: string;
  type: ErrorTypeImplementation;
}

/**
 * Creates a `CollectionTreeImplementation` from a tree definition,
 * resolving all service calls through the client.
 */
export async function reproduce(
  collection: CollectionTree | Promise<CollectionTree>,
  rpc: RPCClient,
  options?: RPCReproduceOptions
): Promise<CollectionTreeImplementation> {
  const opts = Object.assign(
    {
      proxyError: {
        name: 'ProxyError',
        type: error({ code: 'ServerGateway' })
      }
    },
    options
  );

  const implementation = collections(
    toImplementation(await collection, (service, info) => {
      const { types } = service;
      if (isServiceQuery(service)) {
        return query({
          types,
          resolve: (data: any) => rpc.query(info.route.join(':'), data)
        });
      } else if (isServiceMutation(service)) {
        return mutation({
          types,
          resolve: (data: any) => rpc.mutation(info.route.join(':'), data)
        });
      } else if (isServiceSubscription(service)) {
        return subscription({
          types,
          resolve: (data: any) => rpc.subscription(info.route.join(':'), data)
        });
      } else {
        throw Error(`Invalid service kind: ${JSON.stringify(service)}`);
      }
    }),
    types({ [opts.proxyError.name]: opts.proxyError.type })
  );

  return intercepts(
    implementation,
    intercept({
      errors: references(implementation, [opts.proxyError.name]),
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
