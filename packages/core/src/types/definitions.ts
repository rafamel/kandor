import { JSONSchema4 } from 'json-schema';
import { ElementUnion } from './collection';
import { ServiceKind } from './kind';

export type JSONSchema = JSONSchema4;

export interface ElementInfo {
  path: string[];
  route?: string[];
}

export interface ServiceInfo extends ElementInfo {
  kind: ServiceKind;
}

export interface ElementItem<
  E extends ElementUnion = ElementUnion,
  N extends string = string
> {
  name: N;
  item: E;
}

export type Optional<T extends Record<string, any>, K extends keyof T> = Omit<
  T,
  K
> &
  { [P in K]?: T[P] };
