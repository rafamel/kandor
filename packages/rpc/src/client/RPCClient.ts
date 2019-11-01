import { ClientManager } from './ClientManager';
import {
  RPCClientConnection,
  RPCClientOptions,
  RPCClientStatus
} from './types';
import { createDefaults } from './defaults';
import { Observable } from 'rxjs';
import { handleUnaryRequest } from './handle-unary';
import { handleStreamRequest } from './handle-stream';

export class RPCClient {
  private id: number;
  private options: Required<RPCClientOptions>;
  private manager: ClientManager;
  public constructor(
    connection: RPCClientConnection,
    options?: RPCClientOptions
  ) {
    this.id = 1;
    this.options = Object.assign(createDefaults(), options);
    this.manager = new ClientManager(
      connection,
      this.options.parser,
      this.options.subscribePolicy !== 'fail',
      this.options.batch
    );
  }
  public get status(): RPCClientStatus {
    return this.manager.status;
  }
  public get errors(): Error[] {
    return this.manager.errors;
  }
  public get status$(): Observable<RPCClientStatus> {
    return this.manager.status$;
  }
  public get errors$(): Observable<Error> {
    return this.manager.errors$;
  }
  public close(): void {
    return this.manager.close();
  }
  public unary(route: string, data?: any): Promise<any> {
    return handleUnaryRequest(
      route,
      data || null,
      () => this.nextId(),
      this.manager,
      this.options.responseTimeout || 0
    );
  }
  public stream(route: string, data?: any): Observable<any> {
    return handleStreamRequest(
      route,
      data || null,
      () => this.nextId(),
      this.manager,
      this.options.responseTimeout || 0,
      this.options.subscribePolicy === 'no-fail',
      this.options.unsubscribePolicy || 'complete'
    );
  }
  private nextId(): number | string {
    return this.id++;
  }
}
