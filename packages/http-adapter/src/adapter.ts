import http from 'http';
import { CollectionTreeImplementation } from '@karmic/core';
import { RESTServer, RESTServerMethod } from '@karmic/rest';
import { HTTPAdapter, HTTPAdapterOptions } from '~/types';

export default function adapter(
  collection: CollectionTreeImplementation,
  options?: HTTPAdapterOptions
): HTTPAdapter {
  const server = new RESTServer(collection, options);
  const opts = Object.assign({ context: () => ({}) }, options);

  return {
    declaration: server.declaration,
    connect(req: http.IncomingMessage, res: http.ServerResponse): void {
      server
        .request(
          (req.method || '') as RESTServerMethod,
          req.url || '',
          (req as any).body || {},
          () => opts.context(req)
        )
        .then(async (value) => {
          res.statusCode = value.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(value.data));
        })
        .catch(() => {
          res.statusCode = 500;
          res.end();
        });
    }
  };
}
