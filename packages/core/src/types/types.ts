import { JSONSchema4 } from 'json-schema';

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
  | 'ServerUnavailable'
  | 'ServerTimeout';

export type GenericError = 'ClientError' | 'ServerError';
