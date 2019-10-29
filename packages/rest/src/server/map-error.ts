import { ErrorLabel, PublicError } from '@karmic/core';

export const hash: { [P in ErrorLabel]: number } = {
  // Client
  ClientError: 400,
  ClientUnauthorized: 401,
  ClientForbidden: 403,
  ClientNotFound: 404,
  ClientUnsupported: 406,
  ClientConflict: 409,
  ClientInvalid: 422,
  ClientTooEarly: 425,
  ClientRateLimit: 429,
  ClientLegal: 451,
  // Server
  ServerError: 500,
  ServerNotImplemented: 501,
  ServerGateway: 502,
  ServerUnavailable: 503,
  ServerTimeout: 504
};

export default function mapError(
  error: PublicError
): null | { error: PublicError; status: number } {
  const status = hash[error.label];

  return status ? { error, status } : null;
}
