import { ErrorCode, PublicError } from '@karmic/core';

export const hash: { [P in ErrorCode]: number } = {
  // Client
  ClientError: 400,
  ClientUnauthorized: 401,
  ClientForbidden: 403,
  ClientNotFound: 404,
  ClientConflict: 409,
  ClientUnsupported: 406,
  ClientTooEarly: 425,
  ClientRateLimit: 429,
  // Server
  ServerError: 500,
  ServerNotImplemented: 501,
  ServerGateway: 502,
  ServerUnavailable: 503,
  ServerTimeout: 504
};

export default function mapError(
  error: PublicError,
  serverError: PublicError
): { error: PublicError; status: number } {
  const status = hash[error.code];

  return status ? { error, status } : { error: serverError, status: 500 };
}
