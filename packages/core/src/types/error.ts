export type ErrorCode = ClientErrorCode | ServerErrorCode;

export type ClientErrorCode =
  | 'ClientError'
  | 'ClientNotFound'
  | 'ClientForbidden'
  | 'ClientUnauthorized'
  | 'ClientConflict'
  | 'ClientUnsupported'
  | 'ClientTooEarly'
  | 'ClientRateLimit';

export type ServerErrorCode =
  | 'ServerError'
  | 'ServerNotImplemented'
  | 'ServerUnavailable'
  | 'ServerTimeout';
