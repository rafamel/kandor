// Request
export type RPCRequest<D = any> = RPCUnaryRequest<D> | RPCStreamRequest<D>;

export interface RPCUnaryRequest<D = any> {
  id: string;
  route: string;
  action: 'query' | 'mutate';
  data: D;
}

export type RPCStreamRequest<D = any> =
  | RPCSubscribeRequest<D>
  | RPCUnsubscribeRequest;

export interface RPCSubscribeRequest<D = any> {
  id: string;
  route: string;
  action: 'subscribe';
  data: D;
}

export interface RPCUnsubscribeRequest {
  id: string;
  action: 'unsubscribe';
}

// Response
export type RPCResponse<D = any> =
  | RPCSuccessResponse<D>
  | RPCErrorResponse
  | RPCStreamFinalResponse;

export interface RPCSuccessResponse<D = any> {
  id: string;
  status: 'success';
  data: D;
}

export interface RPCErrorResponse {
  id: string;
  status: 'error';
  data: RPCError;
}

export interface RPCStreamFinalResponse {
  id: string;
  status: 'complete' | 'unsubscribe';
}

export interface RPCError {
  id: string;
  label: string;
  message?: string;
}
