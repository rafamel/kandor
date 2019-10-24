import {
  InterceptImplementation,
  Schema,
  ResponseTypeImplementation,
  ServiceErrors,
  RequestType
} from '~/types';
import { Observable } from 'rxjs';

export interface UnaryServiceImplementationInput<I = any, O = any, C = any> {
  types?: ServiceInputTypes;
  resolve: (data: I, context: C) => Promise<O> | O;
  intercepts?: Array<InterceptImplementation<I, O, C>>;
}

export interface StreamServiceImplementationInput<I = any, O = any, C = any> {
  types?: ServiceInputTypes;
  resolve: (data: I, context: C) => Observable<O> | Promise<Observable<O>>;
  intercepts?: Array<InterceptImplementation<I, O, C>>;
}

export interface ServiceInputTypes {
  errors?: ServiceErrors;
  request?: string | Schema | RequestType;
  response?: string | Schema | ResponseTypeImplementation;
}
