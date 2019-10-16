import {
  ServiceErrorsImplementation,
  InterceptSchemasImplementation
} from '~/types';
import { Observable } from 'rxjs';

export interface InterceptCreateInput<I = any, O = any> {
  errors?: ServiceErrorsImplementation;
  factory: InterceptCreateInputFactory<I, O>;
}

export type InterceptCreateInputFactory<I = any, O = any> = (
  schemas: InterceptSchemasImplementation
) => InterceptCreateInputResolve<I, O>;

export type InterceptCreateInputResolve<I = any, O = any> = (
  data: I,
  context: any,
  next: (data?: I) => Observable<O>
) => Observable<O> | Promise<Observable<O>>;

export interface HookCreateInput<T = any> {
  errors?: ServiceErrorsImplementation;
  factory: HookCreateInputFactory<T>;
}

export type HookCreateInputFactory<T = any> = (
  schemas: InterceptSchemasImplementation
) => HookCreateInputResolve<T>;

export type HookCreateInputResolve<T = any> = (
  data: T,
  context: any
) => T | Promise<T>;
