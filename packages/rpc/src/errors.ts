import { RPCSpecErrorType } from './types';

export const ErrorCodes: { [P in RPCSpecErrorType]: [number, string] } = {
  ParseError: [-32700, 'A parsing error occurred on the server.'],
  InvalidRequest: [-32600, 'Received an invalid request object.'],
  MethodNotFound: [-32601, `The method couldn't be found.`],
  InvalidParams: [-32602, 'Invalid method parameters.'],
  InternalError: [-32603, 'Internal JSON-RPC error.']
};
