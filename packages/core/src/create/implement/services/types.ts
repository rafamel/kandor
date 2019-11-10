import {
  ElementInfo,
  QueryServiceImplementation,
  MutationServiceImplementation,
  SubscriptionServiceImplementation
} from '~/types';
import { Observable } from 'rxjs';

export interface QueryServiceImplementationInput<I = any, O = any, C = any>
  extends Partial<Omit<QueryServiceImplementation, 'kind' | 'resolve'>> {
  resolve: (data: I, context: C, info: ElementInfo) => Promise<O> | O;
}

export interface MutationServiceImplementationInput<I = any, O = any, C = any>
  extends Partial<Omit<MutationServiceImplementation, 'kind' | 'resolve'>> {
  resolve: (data: I, context: C, info: ElementInfo) => Promise<O> | O;
}

export interface SubscriptionServiceImplementationInput<
  I = any,
  O = any,
  C = any
> extends Partial<Omit<SubscriptionServiceImplementation, 'kind' | 'resolve'>> {
  resolve: (
    data: I,
    context: C,
    info: ElementInfo
  ) => Observable<O> | Promise<Observable<O>>;
}
