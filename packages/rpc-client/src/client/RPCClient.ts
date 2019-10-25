import { Observable } from 'rxjs';
import WebSocket from 'isomorphic-ws';
import { RPCClientStatus, RPCClientOptions } from './types';
import { ClientManager } from './client-manager';
import { defaultOptions } from './defaults';
import { handleUnaryRequest, handleStreamRequest } from './helpers';

export default class RPCClient {
  private id: number;
  private options: Required<RPCClientOptions>;
  private manager: ClientManager;
  constructor(
    address: string,
    wsco?: WebSocket.ClientOptions | null,
    options?: RPCClientOptions | null
  ) {
    this.id = 1;
    this.options = defaultOptions(options);
    this.manager = new ClientManager(
      address,
      wsco || {},
      this.options.attempts,
      this.options.timeouts.connect || 0,
      this.options.timeouts.response || 0,
      this.options.policies.subscribe !== 'fail'
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
  public query(route: string, data?: any): Promise<any> {
    return handleUnaryRequest(
      {
        id: this.nextId(),
        action: 'query',
        route,
        data
      },
      this.manager,
      this.options.timeouts.response || 0
    );
  }
  public mutation(route: string, data?: any): Promise<any> {
    return handleUnaryRequest(
      {
        id: this.nextId(),
        action: 'mutate',
        route,
        data
      },
      this.manager,
      this.options.timeouts.response || 0
    );
  }
  public subscription(route: string, data?: any): Observable<any> {
    return handleStreamRequest(
      { route, data },
      this.manager,
      this.options.timeouts.response || 0,
      this.options.policies.subscribe === 'no-fail',
      this.options.policies.unsubscribe || 'complete',
      () => this.nextId()
    );
  }
  private nextId(): string {
    return String(this.id++);
  }
}
