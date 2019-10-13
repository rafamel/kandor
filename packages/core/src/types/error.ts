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
