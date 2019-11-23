export type ExceptionLabel = ClientExceptionLabel | ServerExceptionLabel;

export type ClientExceptionLabel =
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

export type ServerExceptionLabel =
  | 'ServerError'
  | 'ServerNotImplemented'
  | 'ServerGateway'
  | 'ServerUnavailable'
  | 'ServerTimeout';

export type GeneralException = 'ClientError' | 'ServerError';
