import {
  CollectionTreeDeclaration,
  CollectionTreeImplementation,
  Application,
  Collection,
  Service
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
    const app = new Application(
      Collection.merge(
        collection,
        Collection.exceptions({ [opts.complete.name]: opts.complete.item })
      ),
      options && options.fallback
        ? { fallback: options.fallback, children: opts.children }
        : { children: opts.children }
    );
    const dapp = new Application(
      Collection.services({
        declaration: Service.query({ resolve: () => app.declaration })
      })
    );

    this.declaration = app.declaration;
    this.manager = new ServerManager(
      {
        ':fallback': {
          declaration: {
            kind: 'query',
            request: '',
            response: '',
            exceptions: []
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
