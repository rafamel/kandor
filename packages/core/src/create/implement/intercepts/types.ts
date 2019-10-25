import {
  ServiceErrorsImplementation,
  InterceptSchemasImplementation,
  ServiceInfo
} from '~/types';
import { Observable } from 'rxjs';

export interface InterceptCreateInput<I = any, O = any, C = any> {
  errors?: ServiceErrorsImplementation;
  factory: InterceptCreateInputFactory<I, O, C>;
}

export type InterceptCreateInputFactory<I = any, O = any, C = any> = (
  schemas: InterceptSchemasImplementation
) => InterceptCreateInputResolve<I, O, C>;

export type InterceptCreateInputResolve<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: ServiceInfo,
  next: (data?: I) => Observable<O>
) => Observable<O> | Promise<Observable<O>>;

export interface HookCreateInput<T = any, C = any> {
  errors?: ServiceErrorsImplementation;
  factory: HookCreateInputFactory<T, C>;
}

export type HookCreateInputFactory<T = any, C = any> = (
  schemas: InterceptSchemasImplementation
) => HookCreateInputResolve<T, C>;

export type HookCreateInputResolve<T = any, C = any> = (
  data: T,
  context: C,
  info: ServiceInfo
) => T | void | Promise<T | void>;
