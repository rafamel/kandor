import { ChannelManager } from '../ChannelManager';
import {
  RPCSpecNotification,
  RPCSingleResponse,
  RPCRequest,
  RPCNotification
} from '~/types';
import { hasNonNullId } from './helpers';
import { ApplicationServices, isServiceSubscription } from '@karmic/core';
import { Observable, isObservable } from 'rxjs';
import { subscribe } from 'promist';
import { containsKey } from 'contains-key';

export function handleNotification(
  request: RPCSpecNotification,
  channels: ChannelManager
): void {
  switch (request.method) {
    case ':complete': {
      if (
        hasNonNullId(request.params) &&
        channels.exists(request.params.id) &&
        channels.isSubscription(request.params.id)
      ) {
        return channels.close(request.params.id);
      }
      break;
    }
    default: {
      break;
    }
  }
}

export function handleUnary(
  request: RPCRequest,
  context: any,
  channels: ChannelManager,
  routes: ApplicationServices,
  cb: (data: RPCSingleResponse) => void
): void {
  const method = containsKey(routes, request.method)
    ? request.method
    : ':fallback';
  const service = routes[method];

  const result = service.resolve(request.params || {}, context);
  return channels.unary(
    request.id,
    isObservable(result) ? subscribe(result) : result,
    cb
  );
}

export function handleStream(
  request: RPCRequest,
  context: any,
  channels: ChannelManager,
  routes: ApplicationServices,
  cb: (data: RPCSingleResponse | RPCNotification) => void
): void {
  if (!containsKey(routes, request.method) as boolean) {
    const result = routes[':fallback'].resolve(request.params || {}, context);
    return isObservable(result)
      ? channels.stream(request.id, result, cb)
      : channels.unary(request.id, result, cb);
  }

  const service = routes[request.method];
  if (!isServiceSubscription(service.declaration)) {
    return channels.error(request.id, ({ spec }) => spec('InvalidRequest'), cb);
  }

  return channels.stream(
    request.id,
    service.resolve(request.params || {}, context) as Observable<any>,
    cb
  );
}
