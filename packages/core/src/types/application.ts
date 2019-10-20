import { CollectionTreeDeclaration } from './collection';
import { Observable } from 'rxjs';

export interface Application {
  declaration: CollectionTreeDeclaration;
  routes: ApplicationRoutes;
}

export interface ApplicationRoutes {
  [key: string]: ApplicationRouteItem;
}

export type ApplicationRouteItem = ApplicationResolve | ApplicationRoutes;

export type ApplicationResolve<I = any, O = any, C = any> =
  | UnaryApplicationResolve<I, O, C>
  | StreamApplicationResolve<I, O, C>;

export type UnaryApplicationResolve<I = any, O = any, C = any> = (
  data: I,
  context: C
) => Promise<O>;

export type StreamApplicationResolve<I = any, O = any, C = any> = (
  data: I,
  context: C
) => Observable<O>;
