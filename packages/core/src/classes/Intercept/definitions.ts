import {
  ServiceExceptionsImplementation,
  InterceptSchemasImplementation,
  ServiceInfo
} from '~/types';
import { Observable } from 'rxjs';

/* Main */
export interface InterceptInput<I, O, C> {
  kind?: 'intercept';
  exceptions?: ServiceExceptionsImplementation;
  factory?: InterceptInputFactory<I, O, C>;
}

export type InterceptInputFactory<I = any, O = any, C = any> = (
  schemas: InterceptSchemasImplementation
) => InterceptInputResolve<I, O, C>;

export type InterceptInputResolve<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: Required<ServiceInfo>,
  next: (data?: I) => Observable<O>
) => Observable<O> | Promise<Observable<O>>;

/* Input */
export interface InterceptHookInput<T, C> {
  exceptions?: ServiceExceptionsImplementation;
  factory: InterceptHookInputFactory<T, C>;
}

export type InterceptHookInputFactory<T, C> = (
  schemas: InterceptSchemasImplementation
) => InterceptHookInputResolve<T, C>;

export type InterceptHookInputResolve<T, C> = (
  data: T,
  context: C,
  info: Required<ServiceInfo>
) => T | void | Promise<T | void>;
