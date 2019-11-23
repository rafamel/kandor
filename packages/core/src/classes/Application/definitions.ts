import { Observable } from 'rxjs';
import {
  CollectionTreeDeclaration,
  ServiceDeclaration,
  QueryServiceImplementation,
  ServiceImplementation,
  ElementInfo
} from '~/types';

/* Input */
export interface ApplicationInput {
  declaration: CollectionTreeDeclaration;
  fallback: UnaryApplicationResolve;
  routes: ApplicationRoutes;
}

/* Options */
export interface ApplicationCreateOptions {
  /**
   * Whether the collection should be validated - see `validate`. Default: `true`.
   */
  validate?: boolean;
  /**
   * Whether to include response types with children as routes. Default: `true`.
   */
  children?: boolean;
  /**
   * Maps a service to its route resolver. It's not applied to `default`.
   */
  map?: ApplicationCreateOptionsMapFn;
  /**
   * A fallback service for adapters to use when the route is non existent.
   * Defaults to a `ClientNotFound` error throwing service.
   */
  fallback?: QueryServiceImplementation;
}

export type ApplicationCreateOptionsMapFn<I = any, O = any, C = any> = (
  service: ServiceImplementation<I, O, C>,
  info: Required<ElementInfo>
) => ApplicationResolve<I, O, C>;

/* Types */
export interface ApplicationRoutes {
  [key: string]: ApplicationResolve | ApplicationRoutes;
}

export type ApplicationServices = Record<string, ApplicationService>;

export interface ApplicationService<
  R extends ApplicationResolve = ApplicationResolve
> {
  declaration: ServiceDeclaration;
  resolve: R;
}

export type ApplicationResolve<I = any, O = any, C = any> = (
  data: I,
  context: C
) => Promise<O> | Observable<O>;

export type UnaryApplicationResolve<I = any, O = any, C = any> = (
  data: I,
  context: C
) => Promise<O>;

export type StreamApplicationResolve<I = any, O = any, C = any> = (
  data: I,
  context: C
) => Observable<O>;
