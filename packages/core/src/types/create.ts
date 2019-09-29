import {
  AppService,
  AppResponseType,
  AppRequestType,
  AppErrorType,
  FreeItem,
  QueryService,
  SubscriptionService
} from './collection';
import { ErrorCode } from './error';
import { Schema } from './schema';

// Services
export type InputService<T extends AppService> = Omit<T, 'types'> & {
  types: InputServiceTypes;
};

export interface InputServiceTypes {
  errors?: Array<InputInlineError | FreeItem<AppErrorType> | string>;
  request?: InputInlineRequest | FreeItem<AppRequestType> | string;
  response?: InputInlineResponse | FreeItem<AppResponseType> | string;
}
export type InputInlineError = { name: string; code: ErrorCode };
export type InputInlineRequest = Schema;
export type InputInlineResponse = Schema;

export type InputError = AppErrorType;
export type InputRequest = AppRequestType;
export type InputResponse<T = any> = Omit<AppResponseType<T>, 'children'> & {
  children?: Array<FreeItem<QueryService | SubscriptionService>>;
};

// Hooks
export type InputHook = ({ errors?: Array<InputInlineError | string> }) &
  (
    | { before?: InputHookFn; after: InputHookFn }
    | { before: InputHookFn; after?: InputHookFn }
    | { before: InputHookFn; after: InputHookFn });
export type InputHookFn<I = any> = (
  data: I,
  context: any
) => void | Promise<void>;
