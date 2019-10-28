export interface RPCSpecNotification {
  jsonrpc: '2.0';
  method: string;
  params?: any;
}

export interface RPCSpecRequest {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: any;
}

export type RPCSpecResponse =
  | RPCSpecSuccessResponse
  | RPCSpecErrorResponse
  | Array<RPCSpecSuccessResponse | RPCSpecErrorResponse>;

export interface RPCSpecSuccessResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result: any;
  error?: never;
}

export interface RPCSpecErrorResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: never;
  error: RPCSpecError;
}

export interface RPCSpecError {
  code: number;
  message: string;
  data?: any;
}

export type RPCSpecErrorType =
  | 'ParseError'
  | 'InvalidRequest'
  | 'MethodNotFound'
  | 'InvalidParams'
  | 'InternalError';
