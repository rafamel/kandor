import {
  InterceptImplementation,
  ServiceErrorsImplementation,
  Schema,
  RequestTypeImplementation,
  ResponseTypeImplementation
} from '~/types';
import { Observable } from 'rxjs';

export interface QueryServiceInput<I = any, O = any> {
  types?: ServiceInputTypes;
  resolve: (data: I, context: any) => Promise<O> | O;
  intercepts?: Array<InterceptImplementation<I, O>>;
}

export interface MutationServiceInput<I = any, O = any> {
  types?: ServiceInputTypes;
  resolve: (data: I, context: any) => Promise<O> | O;
  intercepts?: Array<InterceptImplementation<I, O>>;
}

export interface SubscriptionServiceInput<I = any, O = any> {
  types?: ServiceInputTypes;
  resolve: (data: I, context: any) => Observable<O> | Promise<Observable<O>>;
  intercepts?: Array<InterceptImplementation<I, O>>;
}

export interface ServiceInputTypes {
  errors?: ServiceErrorsImplementation;
  request?: string | Schema | RequestTypeImplementation;
  response?: string | Schema | ResponseTypeImplementation;
}
