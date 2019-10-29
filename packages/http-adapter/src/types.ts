import http from 'http';
import { CollectionTreeDeclaration } from '@karmic/core';

export interface HTTPAdapter {
  /**
   * Resulting collection declaration, including the necessary
   * modifications made by the adapter.
   */
  declaration: CollectionTreeDeclaration;
  /**
   * Connect handler executing the collection's services.
   */
  connect: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next?: () => void
  ) => void;
}

export interface HTTPAdapterOptionsOnly {
  /**
   * A function to provide context before services are called.
   */
  context?: HTTPAdapterProvideContext;
}

export type HTTPAdapterProvideContext<C = any> = (
  req: http.IncomingMessage
) => Promise<C> | Partial<C>;
