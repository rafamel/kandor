import { JSONSchema4 } from 'json-schema';
import { ServiceKind } from './collection';

export type Schema = JSONSchema4;

export type ErrorCode = ClientErrorCode | ServerErrorCode;

export type ClientErrorCode =
  | 'ClientError'
  | 'ClientUnauthorized'
  | 'ClientForbidden'
  | 'ClientNotFound'
  | 'ClientConflict'
  | 'ClientUnsupported'
  | 'ClientTooEarly'
  | 'ClientRateLimit';

export type ServerErrorCode =
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
  kind: ServiceKind;
}
