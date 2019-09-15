import { Observable } from '../observable';

// Definition
export interface ServiceDefinition {
  types: ServiceTypes;
}

export interface ServiceTypes {
  errors: string[];
  request: string;
  response: string;
}

// Implementation
export interface ServiceImplementation<I = any> extends ServiceDefinition {
  resolve(data: I, context: any): any;
}

export interface QueryService<I = any, O = any>
  extends ServiceImplementation<I> {
  resolve(data: I, context: any): O | Promise<O>;
}
export interface MutationService<I = any, O = any>
  extends ServiceImplementation<I> {
  resolve(data: I, context: any): O | Promise<O>;
}
export interface SubscriptionService<I = any, O = any>
  extends ServiceImplementation<I> {
  resolve(
    data: I,
    context: any
  ): Observable<O | Promise<O>> | Promise<Observable<O | Promise<O>>>;
}
