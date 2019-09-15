import {
  AppService,
  QueryService,
  SubscriptionService,
  MutationService,
  AppCollectionTree,
  AppResponseType,
  AppRequestType,
  AppErrorType
} from './collection';
import { ErrorCode } from './error';
import { Schema } from './schema';

// Services
export type InputService<T extends AppService> = Omit<T, 'types'> & {
  types: InputServiceTypes;
};

export interface InputServiceTypes {
  errors?: Array<InputInlineError | string>;
  request?: InputInlineRequest | string;
  response?: InputInlineResponse | string;
}
export type InputInlineError = { name: string; code: ErrorCode };
export type InputInlineRequest = Schema;
export type InputInlineResponse = Schema;

export type InputServices = {
  [key: string]: ServiceItem;
} & {
  get?: ServiceItem<QueryService | SubscriptionService>;
  list?: ServiceItem<QueryService | SubscriptionService>;
  create?: ServiceItem<MutationService>;
  patch?: ServiceItem<MutationService>;
  update?: ServiceItem<MutationService>;
  delete?: ServiceItem<MutationService>;
};

export interface ServiceItem<T extends AppService = AppService> {
  kind: keyof AppCollectionTree['services'];
  types: ServiceItemTypes;
  service: T;
}
export interface ServiceItemTypes {
  errors?: InputInlineError[];
  request?: InputInlineRequest;
  response?: InputInlineResponse;
}

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

// Types
export type InputError = AppErrorType;
export type InputRequest = AppRequestType;
export type InputResponse<T = any> = Omit<AppResponseType<T>, 'children'> & {
  children?: Partial<AppResponseType<T>['children']>;
};
