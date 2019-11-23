import {
  ElementInfo,
  ServiceKind,
  QueryServiceKind,
  MutationServiceKind,
  ServiceResolveImplementation,
  ServiceUnion,
  InterceptImplementation,
  SubscriptionServiceKind,
  UnaryServiceResolveImplementation,
  StreamServiceResolveImplementation,
  ServiceDeclaration,
  ServiceImplementation
} from '~/types';
import { Observable } from 'rxjs';
import { Service } from './Service';

type Input = Omit<Partial<ServiceUnion>, 'resolve'>;
type Maybe<T, U> = T extends Function ? U : void;
type Resolve<K extends ServiceKind, I, O, C> = K extends 'query' | 'mutation'
  ? UnaryServiceResolveImplementation<I, O, C>
  : K extends 'subscription'
  ? StreamServiceResolveImplementation<I, O, C>
  : ServiceResolveImplementation<I, O, C>;

/* Main */
export type ServiceConstructor = <
  K extends ServiceKind = ServiceKind,
  T = void,
  I = any,
  O = any,
  C = any
>(
  service: ServiceInput<K, T, I, O, C>
) => Service<K, T, I, O, C>;

export type ServiceInput<K extends ServiceKind, T, I, O, C> =
  | Service<K, T, I, O, C>
  | ServiceDeclaration
  | ServiceImplementation<I, O, C>
  | (Record<'kind', K> &
      (
        | ServiceSubscriptionInput<T, I, O, C>
        | ServiceMutationInput<T, I, O, C>
        | ServiceQueryInput<T, I, O, C>
      ));

export type ServiceElement<K extends ServiceKind, T, I, O, C> = ServiceUnion &
  Record<'kind', K> &
  Record<'resolve', Maybe<T, Resolve<K, I, O, C>>> &
  Record<'intercepts', Maybe<T, InterceptImplementation[]>>;

/* Input */
export type ServiceQueryInput<T, I, O, C> = Input & {
  kind?: QueryServiceKind;
  resolve?: T | ServiceUnaryResolveInput<I, O, C>;
};

export type ServiceMutationInput<T, I, O, C> = Input & {
  kind?: MutationServiceKind;
  resolve?: T | ServiceUnaryResolveInput<I, O, C>;
};

export type ServiceSubscriptionInput<T, I, O, C> = Input & {
  kind?: SubscriptionServiceKind;
  resolve?: T | ServiceStreamResolveInput<I, O, C>;
};

export type ServiceUnaryResolveInput<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: Required<ElementInfo>
) => Promise<O> | O;

export type ServiceStreamResolveInput<I = any, O = any, C = any> = (
  data: I,
  context: C,
  info: Required<ElementInfo>
) => Observable<O> | Promise<Observable<O>>;

/* Options */
export interface ServiceInterceptOptions {
  /**
   * Whether intercepts should be prepended or apended to the existing ones.
   * Default: `true`.
   */
  prepend?: boolean;
}
