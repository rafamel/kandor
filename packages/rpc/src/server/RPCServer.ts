import {
  CollectionTreeImplementation,
  application,
  CollectionTreeDeclaration,
  ApplicationServices,
  services,
  query
} from '@karmic/core';
import {
  RPCServerOptions,
  RPCServerConnection,
  RPCServerConnect,
  RPCServerProvideContext
} from './types';
import { createDefaults } from './defaults';
import { DataInput } from '~/types';
import { createEnsureError } from './errors';
import { ChannelManager } from './ChannelManager';
import { resolve } from './resolve';
import { lazy } from 'promist';

export class RPCServer {
  public declaration: CollectionTreeDeclaration;
  private routes: ApplicationServices;
  private options: Required<Omit<RPCServerOptions, 'default'>>;
  public constructor(
    collection: CollectionTreeImplementation,
    options?: RPCServerOptions
  ) {
    this.options = Object.assign(createDefaults(), options);

    const app = application(
      collection,
      options && options.default
        ? { default: options.default, children: this.options.children }
        : { children: this.options.children }
    );
    const dapp = application(
      services({ declaration: query({ resolve: () => app.declaration }) })
    );

    this.declaration = app.declaration;
    this.routes = {
      ':default': {
        declaration: {
          kind: 'query',
          types: { request: '', response: '', errors: {} }
        },
        resolve: app.default
      },
      ':declaration': dapp.flatten(':').declaration,
      ...app.flatten(':')
    };
  }
  public connect(
    connect: RPCServerConnect,
    provide?: RPCServerProvideContext
  ): RPCServerConnection {
    const ensureError = createEnsureError(this.declaration);
    const channels = new ChannelManager(ensureError);
    const context = lazy.fn(provide || (() => ({})));

    let open = true;
    return {
      request: (data: DataInput): void => {
        return resolve(
          data,
          context,
          channels,
          this.routes,
          async (data) => this.options.parser.deserialize(data),
          (error: Error) => {
            if (open) connect.fatal(error);
          },
          (data) => {
            if (!open) return;
            const serialize = async (): Promise<void> => {
              const buffer = await this.options.parser.serialize(data);
              if (open) await connect.send(buffer);
            };
            serialize().catch((err) => connect.fatal(err));
          }
        );
      },
      close(): void {
        open = false;
        channels.destroy();
      }
    };
  }
}
