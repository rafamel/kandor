import http from 'http';
import {
  CollectionTreeImplementation,
  QueryServiceImplementation,
  toUnary
} from '@karmic/core';
import { RPCServer, DataInput, DataOutput } from '@karmic/rpc';
import { HTTPAdapterOptionsOnly, HTTPAdapter } from '~/types';
import { Subject } from 'rxjs';

export interface HTTPAdapterRpcOptions extends HTTPAdapterOptionsOnly {
  /**
   * Whether to create routes for type's children services.
   * Default: `true`.
   */
  children?: boolean;
  /**
   * A default service for adapters to use when the route is non existent.
   * Defaults to a `ClientNotFound` error throwing service.
   */
  default?: QueryServiceImplementation;
}

export function rpc(
  collection: CollectionTreeImplementation,
  options?: HTTPAdapterRpcOptions
): HTTPAdapter {
  const opts = Object.assign({ context: () => {}, children: true }, options);
  const parser = {
    serialize: (data: object): DataOutput => JSON.stringify(data),
    deserialize: (data: DataInput): object => data as object
  };
  const server = new RPCServer(
    toUnary(collection),
    opts.default
      ? { children: opts.children, default: opts.default, parser }
      : { children: opts.children, parser }
  );

  return {
    declaration: server.declaration,
    connect(req: http.IncomingMessage, res: http.ServerResponse, next): void {
      if (
        (req.method || '').toUpperCase() !== 'POST' ||
        !req.url ||
        !['', '/'].includes(req.url)
      ) {
        return next ? next() : undefined;
      }

      const data$ = new Subject<DataInput>();
      let disconnect: null | (() => void) = null;
      const promise = new Promise<DataOutput>((resolve, reject) => {
        disconnect = server.connect({
          context: () => opts.context(req),
          actions: {
            report: (err) => reject(err),
            send: (data) => resolve(data),
            close: () => reject(Error(`Call closed ahead of time`))
          },
          data$: data$.asObservable()
        });
      });

      data$.next((req as any).body || {});

      promise
        .then((data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(data);

          data$.complete();
          if (disconnect) disconnect();
        })
        .catch(() => {
          res.statusCode = 500;
          res.end();

          data$.complete();
          if (disconnect) disconnect();
        });
    }
  };
}
