import {
  RPCSpecSuccessResponse,
  RPCSpecErrorResponse,
  RPCSpecError
} from './specification';
import { ExceptionLabel } from '@karmic/core';

export type RPCResponse<T = any> =
  | RPCSingleResponse<T>
  | Array<RPCSingleResponse<T>>;

export type RPCSingleResponse<T = any> =
  | RPCSuccessResponse<T>
  | RPCErrorResponse;

export interface RPCSuccessResponse<T = any> extends RPCSpecSuccessResponse {
  result: T;
}

export interface RPCErrorResponse extends RPCSpecErrorResponse {
  error: RPCError;
}

export interface RPCError extends RPCSpecError {
  data?: RPCPublicError;
}

export interface RPCPublicError {
  id: string;
  label: ExceptionLabel;
  description?: string;
}
