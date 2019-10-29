import { CollectionTreeDeclaration, ServiceDeclaration } from './collection';
import { Observable } from 'rxjs';

export interface Application {
  declaration: CollectionTreeDeclaration;
  fallback: UnaryApplicationResolve;
  routes: ApplicationRoutes;
  flatten(delimiter: string): ApplicationServices;
}

export interface ApplicationRoutes {
  [key: string]: ApplicationResolve | ApplicationRoutes;
}

export interface ApplicationServices {
  [key: string]: ApplicationService;
}

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
