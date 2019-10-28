import {
  PublicError,
  ErrorLabel,
  CollectionError,
  CollectionTree,
  GeneralError
} from '@karmic/core';
import { RPCError } from '~/types';
import { ErrorCodes } from '~/errors';

export const hash: { [P in ErrorLabel]: number } = {
  // Client
  ClientError: -32000,
  ClientUnauthorized: -32001,
  ClientForbidden: -32003,
  ClientNotFound: ErrorCodes.MethodNotFound[0],
  ClientConflict: -32009,
  ClientUnsupported: -32006,
  ClientInvalid: ErrorCodes.InvalidParams[0],
  ClientTooEarly: -32025,
  ClientRateLimit: -32029,
  ClientLegal: -32051,
  // Server
  ServerError: -32060,
  ServerNotImplemented: -32061,
  ServerGateway: -32062,
  ServerUnavailable: -32063,
  ServerTimeout: -32064
};

export function createEnsureError(
  collection: CollectionTree
): (error: Error) => PublicError {
  const id: GeneralError = 'ServerError';
  return function ensureError(error) {
    return error instanceof PublicError
      ? error
      : new CollectionError(collection, id, error, true);
  };
}

export function getError(
  err: 'ParseError' | 'InvalidRequest' | PublicError
): RPCError {
  if (typeof err === 'string') {
    const arr = Object.hasOwnProperty.call(ErrorCodes, err)
      ? ErrorCodes[err]
      : ErrorCodes.InternalError;
    return {
      code: arr[0],
      message: arr[1]
    };
  }

  if (!Object.hasOwnProperty.call(hash, err.label)) {
    return {
      code: ErrorCodes.InternalError[0],
      message: ErrorCodes.InternalError[1]
    };
  }

  return {
    code: hash[err.label],
    message: `Server implementation specific error: ${err.label}`,
    data: {
      id: err.id,
      label: err.label,
      description: err.message
    }
  };
}
