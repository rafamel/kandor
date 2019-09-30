import { Schema } from '../schema';
import { ErrorCode } from '../error';
import {
  ErrorTypeImplementation,
  ResponseTypeImplementation,
  RequestTypeImplementation,
  QueryImplementationResolve,
  MutationImplementationResolve,
  SubscriptionImplementationResolve
} from '../collection';
import { Envelope } from './envelope';

// Services
export type InputService<I = any, O = any> =
  | InputQueryService<I, O>
  | InputMutationService<I, O>
  | InputSubscriptionService<I, O>;

export interface InputQueryService<I = any, O = any> {
  types?: InputTypes;
  resolve: QueryImplementationResolve<I, O>;
}
export interface InputMutationService<I = any, O = any> {
  types?: InputTypes;
  resolve: MutationImplementationResolve<I, O>;
}
export interface InputSubscriptionService<I = any, O = any> {
  types?: InputTypes;
  resolve: SubscriptionImplementationResolve<I, O>;
}

// Types
export interface InputTypes {
  errors?: Array<
    InputInlineError | Envelope<ErrorTypeImplementation, string> | string
  >;
  request?:
    | InputInlineRequest
    | Envelope<RequestTypeImplementation, string>
    | string;
  response?:
    | InputInlineResponse
    | Envelope<ResponseTypeImplementation, string>
    | string;
}

export type InputInlineError = { name: string; code: ErrorCode };
export type InputInlineRequest = Schema;
export type InputInlineResponse = Schema;

// Hooks
export type InputHook = {
  errors?: Array<
    InputInlineError | Envelope<ErrorTypeImplementation, string> | string
  >;
  before?: InputHookFn;
  after?: InputHookFn;
};
export type InputHookFn<T = any> = (
  data: T,
  context: any
) => void | Promise<void>;
