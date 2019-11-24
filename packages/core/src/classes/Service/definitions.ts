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
type Falsy = false | null | undefined | void | 0 | '';
type Maybe<T, U> = T extends Falsy ? void : U;
type Resolve<K extends ServiceKind, I, O, C> = K extends 'query' | 'mutation'
  ? UnaryServiceResolveImplementation<I, O, C>
  : K extends 'subscription'
  ? StreamServiceResolveImplementation<I, O, C>
  : ServiceResolveImplementation<I, O, C>;

/* Main */
export type ServiceConstructor = <
  T = false,
  K extends ServiceKind = ServiceKind,
  I = any,
  O = any,
  C = any
>(
  service: ServiceInput<T, K, I, O, C>
) => Service<T, K, I, O, C>;

export type ServiceInput<T, K extends ServiceKind, I, O, C> =
  | Service<T, K, I, O, C>
  | ServiceDeclaration
  | ServiceImplementation<I, O, C>
  | (Record<'kind', K> &
      (
        | ServiceSubscriptionInput<T, I, O, C>
        | ServiceMutationInput<T, I, O, C>
        | ServiceQueryInput<T, I, O, C>
      ));

export type ServiceElement<T, K extends ServiceKind, I, O, C> = ServiceUnion &
  Record<'kind', K> &
  Record<'resolve', Maybe<T, Resolve<K, I, O, C>>> &
  Record<'intercepts', Maybe<T, InterceptImplementation[]>>;

/* Input */
export type ServiceQueryInput<T, I, O, C> = Input &
  Record<'resolve', Function> & {
    kind?: QueryServiceKind;
    resolve: T | ServiceUnaryResolveInput<I, O, C>;
  };

export type ServiceMutationInput<T, I, O, C> = Input &
  Record<'resolve', Function> & {
    kind?: MutationServiceKind;
    resolve: T | ServiceUnaryResolveInput<I, O, C>;
  };

export type ServiceSubscriptionInput<T, I, O, C> = Input &
  Record<'resolve', Function> & {
    kind?: SubscriptionServiceKind;
    resolve: T | ServiceStreamResolveInput<I, O, C>;
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
