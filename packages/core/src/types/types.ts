import { JSONSchema4 } from 'json-schema';
import { ServiceElementKind, ElementUnion } from './collection';

export type Schema = JSONSchema4;

export type ErrorLabel = ClientErrorLabel | ServerErrorLabel;

export type ClientErrorLabel =
  | 'ClientError'
  | 'ClientUnauthorized'
  | 'ClientForbidden'
  | 'ClientNotFound'
  | 'ClientUnsupported'
  | 'ClientConflict'
  | 'ClientInvalid'
  | 'ClientTooEarly'
  | 'ClientRateLimit'
  | 'ClientLegal';

export type ServerErrorLabel =
  | 'ServerError'
  | 'ServerNotImplemented'
  | 'ServerGateway'
  | 'ServerUnavailable'
  | 'ServerTimeout';

export type GeneralError = 'ClientError' | 'ServerError';

export interface ElementInfo {
  path: string[];
  route: string[];
}

export interface ServiceInfo extends ElementInfo {
  kind: ServiceElementKind;
}

export interface ElementItem<
  E extends ElementUnion = ElementUnion,
  N extends string = string
> {
  name: N;
  item: E;
}
