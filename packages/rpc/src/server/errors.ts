import {
  PublicError,
  ErrorLabel,
  CollectionError,
  CollectionTreeUnion,
  ElementItem,
  ErrorTypeUnion
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

export interface ErrorProvider {
  core: (error: PublicErrorProviderType) => RPCError;
  spec: (name: RPCErrorProviderType) => RPCError;
}

export type PublicErrorProviderType = Error | 'Server' | 'EarlyComplete';

export type RPCErrorProviderType =
  | 'ParseError'
  | 'InvalidRequest'
  | 'InternalError';

export function createErrorProvider(
  collection: CollectionTreeUnion,
  complete: ElementItem<ErrorTypeUnion>
): ErrorProvider {
  function ensure(error: PublicErrorProviderType): PublicError {
    return error instanceof PublicError
      ? error
      : new CollectionError(
          collection,
          error === 'EarlyComplete' ? complete.name : 'ServerError',
          null,
          true
        );
  }

  return {
    core(error: PublicErrorProviderType): RPCError {
      const err = ensure(error);
      return Object.hasOwnProperty.call(hash, err.label)
        ? {
            code: hash[err.label],
            message: `Server implementation specific error: ${err.label}`,
            data: {
              id: err.id,
              label: err.label,
              description: err.message
            }
          }
        : {
            code: ErrorCodes.InternalError[0],
            message: ErrorCodes.InternalError[1]
          };
    },
    spec(error: RPCErrorProviderType): RPCError {
      const arr = Object.hasOwnProperty.call(ErrorCodes, error)
        ? ErrorCodes[error]
        : ErrorCodes.InternalError;
      return {
        code: arr[0],
        message: arr[1]
      };
    }
  };
}
