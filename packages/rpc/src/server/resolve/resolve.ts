import { ChannelManager } from '../ChannelManager';
import { ApplicationServices } from '@karmic/core';
import { RPCResponse, RPCSingleResponse, RPCNotification } from '~/types';
import { handleNotification, handleUnary, handleStream } from './handlers';
import { validate } from '~/validate';
import { isValidRequest, hasNonNullId } from './helpers';

export function resolveSingle(
  request: object,
  context: any,
  channels: ChannelManager,
  routes: ApplicationServices,
  send: (data: RPCSingleResponse | RPCNotification) => void
): void {
  if (validate.notification(request)) {
    return handleNotification(request, channels);
  }

  if (isValidRequest(request)) {
    if (channels.exists(request.id)) {
      return channels.error(null, 'InvalidRequest', send);
    }

    return request.stream
      ? handleStream(request, context, channels, routes, send)
      : handleUnary(request, context, channels, routes, send);
  }

  return channels.error(
    hasNonNullId(request) ? request.id : null,
    'InvalidRequest',
    send
  );
}

export async function resolveBatch(
  requests: object[],
  context: any,
  channels: ChannelManager,
  routes: ApplicationServices,
  send: (data: RPCResponse) => void
): Promise<void> {
  if (!requests.length) {
    return channels.error(null, 'InvalidRequest', send);
  }

  const promises: Array<Promise<RPCSingleResponse>> = [];

  for (const request of requests) {
    if (validate.notification(request)) {
      handleNotification(request, channels);
    } else {
      promises.push(
        new Promise((resolve: (data: RPCSingleResponse) => void, reject) => {
          try {
            if (!isValidRequest(request) || request.stream) {
              return channels.error(
                hasNonNullId(request) ? request.id : null,
                'InvalidRequest',
                resolve
              );
            }

            return channels.exists(request.id)
              ? channels.error(null, 'InvalidRequest', resolve)
              : handleUnary(request, context, channels, routes, resolve);
          } catch (err) {
            reject(err);
          }
        })
      );
    }
  }

  await Promise.all(promises).then((arr) => send(arr));
}
