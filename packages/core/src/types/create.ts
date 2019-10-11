import {
  ServiceTypesImplementation,
  ErrorTypeImplementation,
  RequestTypeImplementation,
  ResponseTypeImplementation,
  InterceptSchemasImplementation,
  ServiceErrorsImplementation,
  InterceptImplementation
} from './collection';
import { Observable } from './observable';

// Input
export interface InputQueryService<I = any, O = any> {
  types?: ServiceTypesImplementation;
  intercepts?: Array<InterceptImplementation<I, O>>;
  resolve: (data: I, context: any) => Promise<O> | O;
}
export interface InputMutationService<I = any, O = any> {
  types?: ServiceTypesImplementation;
  intercepts?: Array<InterceptImplementation<I, O>>;
  resolve: (data: I, context: any) => Promise<O> | O;
}
export interface InputSubscriptionService<I = any, O = any> {
  types?: ServiceTypesImplementation;
  intercepts?: Array<InterceptImplementation<I, O>>;
  resolve: (data: I, context: any) => Observable<O> | Promise<Observable<O>>;
}

export type InputErrorType = Omit<ErrorTypeImplementation, 'kind'>;
export type InputRequestType = Omit<RequestTypeImplementation, 'kind'>;
export type InputResponseType = Omit<ResponseTypeImplementation, 'kind'>;

// Intercepts
export interface InputIntercept<I = any, O = any> {
  errors?: ServiceErrorsImplementation;
  factory: InputInterceptFactory<I, O>;
}

export type InputInterceptFactory<I = any, O = any> = (
  schemas: InterceptSchemasImplementation
) => InputInterceptResolve<I, O>;

export type InputInterceptResolve<I = any, O = any> = (
  data: I,
  context: any,
  next: (data?: I) => Observable<O>
) => Observable<O> | Promise<Observable<O>>;

export interface InputInterceptHook<T = any> {
  errors?: ServiceErrorsImplementation;
  factory: InputInterceptHookFactory<T>;
}

export type InputInterceptHookFactory<T = any> = (
  schemas: InterceptSchemasImplementation
) => InputInterceptHookResolve<T>;

export type InputInterceptHookResolve<T = any> = (
  data: T,
  context: any
) => T | Promise<T>;
