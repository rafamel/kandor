import {
  CollectionTreeImplementation,
  application,
  CollectionTreeDeclaration,
  services,
  query,
  collections,
  types
} from '@karmic/core';
import { RPCServerOptions, RPCServerConnection } from './types';
import { createDefaults } from './defaults';
import { ServerManager } from './ServerManager';
import { createErrorProvider } from './errors';

export class RPCServer {
  public declaration: CollectionTreeDeclaration;
  private manager: ServerManager;
  public constructor(
    collection: CollectionTreeImplementation,
    options?: RPCServerOptions
  ) {
    const opts = Object.assign(createDefaults(), options);
    const app = application(
      collections(
        collection,
        types({ [opts.complete.name]: opts.complete.item })
      ),
      options && options.fallback
        ? { fallback: options.fallback, children: opts.children }
        : { children: opts.children }
    );
    const dapp = application(
      services({ declaration: query({ resolve: () => app.declaration }) })
    );

    this.declaration = app.declaration;
    this.manager = new ServerManager(
      {
        ':fallback': {
          declaration: {
            kind: 'query',
            request: '',
            response: '',
            errors: {}
          },
          resolve: app.fallback
        },
        ':declaration': dapp.flatten(':').declaration,
        ...app.flatten(':')
      },
      opts.parser,
      createErrorProvider(this.declaration, opts.complete)
    );
  }
  public connect(connection: RPCServerConnection): () => void {
    return this.manager.connect(connection);
  }
  public terminate(): void {
    return this.manager.terminate();
  }
}
