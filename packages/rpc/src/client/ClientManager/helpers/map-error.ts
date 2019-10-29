import { RPCErrorResponse } from '~/types';
import { PublicError } from '@karmic/core';
import { ErrorCodes } from '~/errors';

const codesToNameDescription = Object.entries(ErrorCodes).reduce(
  (acc: { [key: string]: string }, value) => {
    acc[value[1][0]] = `${value[0]}: ${value[1][1]}`;
    return acc;
  },
  {}
);

export function mapError(response: RPCErrorResponse): Error {
  if (
    response.error.data &&
    Object.hasOwnProperty.call(response.error.data, 'id') &&
    Object.hasOwnProperty.call(response.error.data, 'label')
  ) {
    return new PublicError(
      response.error.data.id,
      response.error.data.label,
      null,
      response.error.data.description,
      true
    );
  }

  if (response.error.message) {
    return Error(response.error.message);
  }

  if (
    response.error.code &&
    Object.hasOwnProperty.call(codesToNameDescription, response.error.code)
  ) {
    return Error(codesToNameDescription[response.error.code]);
  }

  return Error(`Unrecognized server error code: ${response.error.code}`);
}
