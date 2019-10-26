import express from 'express';
import {
  isServiceQuery,
  isServiceSubscription,
  CollectionError,
  CollectionTreeImplementation,
  toUnary,
  GeneralError,
  application,
  isElementService,
  filter
} from '@karmic/core';
import { createDefaults } from './defaults';
import mapError from './helpers/map-error';
import parseService from './parse-service';
import { RESTAdapterOptions, RESTAdapter } from './types';

export default function adapter(
  collection: CollectionTreeImplementation,
  options?: RESTAdapterOptions
): RESTAdapter {
  const opts = Object.assign(createDefaults(), options);
  const router = express.Router();

  const app = application(
    opts.subscriptions
      ? toUnary(collection)
      : filter(
          collection,
          (element) =>
            !isElementService(element) || !isServiceSubscription(element)
        ),
    opts.default ? { default: opts.default } : {}
  );

  const internal: GeneralError = 'ServerError';
  const errors = {
    server: new CollectionError(app.declaration, internal)
  };

  const services = app.flatten('/');
  for (const [route, { declaration, resolve }] of Object.entries(services)) {
    const { method, url, map } = parseService(
      route.split('/'),
      opts.crud,
      isServiceQuery(declaration)
    );

    router[method](url, async (req, res) => {
      try {
        const context = await opts.context(req);
        const data = await resolve(map(req), context);
        return res.json(opts.envelope(null, data));
      } catch (err) {
        const { error, status } = mapError(err, errors.server);
        return res.status(status).json(opts.envelope(error, null));
      }
    });
  }

  if (opts.declaration) {
    router.get(
      (opts.declaration[0] === '/' ? '' : '/') + opts.declaration,
      (req, res) => res.json(app.declaration)
    );
  }

  router.use(async (req, res) => {
    try {
      const context = await opts.context(req);
      const data = await app.default(req.body, context);
      return res.json(opts.envelope(null, data));
    } catch (err) {
      const { error, status } = mapError(err, errors.server);
      return res.status(status).json(opts.envelope(error, null));
    }
  });

  return {
    router,
    declaration: app.declaration
  };
}
