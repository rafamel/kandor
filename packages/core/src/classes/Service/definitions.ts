import {
  QueryServiceImplementation,
  ElementInfo,
  MutationServiceImplementation,
  SubscriptionServiceImplementation,
  ServiceKind,
  QueryServiceKind,
  MutationServiceKind,
  QueryServiceDeclaration,
  MutationServiceDeclaration,
  SubscriptionServiceDeclaration,
  ServiceResolveImplementation,
  ServiceUnion
} from '~/types';
import { Observable } from 'rxjs';

/* Input */
export type ServiceCreateInput = Omit<Partial<ServiceUnion>, 'kind'>;

export type ServiceQueryInput<I = any, O = any, C = any> = Omit<
  Partial<QueryServiceImplementation>,
  'kind' | 'resolve'
> & {
  resolve(data: I, context: C, info: ElementInfo): Promise<O> | O;
};

export type ServiceMutationInput<I = any, O = any, C = any> = Omit<
  Partial<MutationServiceImplementation>,
  'kind' | 'resolve'
> & {
  resolve(data: I, context: C, info: ElementInfo): Promise<O> | O;
};

export type ServiceSubscriptionInput<I = any, O = any, C = any> = Omit<
  Partial<SubscriptionServiceImplementation>,
  'kind' | 'resolve'
> & {
  resolve(
    data: I,
    context: C,
    info: ElementInfo
  ): Observable<O> | Promise<Observable<O>>;
};

/* Options */
export interface ServiceInterceptOptions {
  /**
   * Whether intercepts should be prepended or apended to the existing ones.
   * Default: `true`.
   */
  prepend?: boolean;
}

/* Maps */
export type ServiceCreate<
  K extends ServiceKind,
  T extends ServiceCreateInput
> = T extends { resolve: ServiceResolveImplementation }
  ? K extends QueryServiceKind
    ? QueryServiceImplementation
    : K extends MutationServiceKind
    ? MutationServiceImplementation
    : SubscriptionServiceImplementation
  : K extends QueryServiceKind
  ? QueryServiceDeclaration
  : K extends MutationServiceKind
  ? MutationServiceDeclaration
  : SubscriptionServiceDeclaration;
