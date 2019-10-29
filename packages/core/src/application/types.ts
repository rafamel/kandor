import {
  ServiceImplementation,
  ElementInfo,
  ApplicationResolve,
  QueryServiceImplementation
} from '~/types';

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
  map?: ApplicationCreateMapFn;
  /**
   * A fallback service for adapters to use when the route is non existent.
   * Defaults to a `ClientNotFound` error throwing service.
   */
  fallback?: QueryServiceImplementation;
}

export type ApplicationCreateMapFn<I = any, O = any, C = any> = (
  service: ServiceImplementation<I, O, C>,
  info: ElementInfo
) => ApplicationResolve<I, O, C>;
