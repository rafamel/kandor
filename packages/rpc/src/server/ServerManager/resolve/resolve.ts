import { ChannelManager } from '../ChannelManager';
import { ApplicationServices } from '@karmic/core';
import { RPCResponse, RPCSingleResponse, RPCNotification } from '~/types';
import { handleNotification, handleUnary, handleStream } from './handlers';
import { validate } from '~/validate';
import { isValidRequest, hasNonNullId } from './helpers';
import { Promist } from 'promist';

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
      return channels.error(null, ({ spec }) => spec('InvalidRequest'), send);
    }

    return request.stream
      ? handleStream(request, context, channels, routes, send)
      : handleUnary(request, context, channels, routes, send);
  }

  return channels.error(
    hasNonNullId(request) ? request.id : null,
    ({ spec }) => spec('InvalidRequest'),
    send
  );
}

export async function resolveBatch(
  requests: object[],
  context: any,
  channels: ChannelManager,
  routes: ApplicationServices,
  send: (data: RPCResponse | RPCNotification) => void
): Promise<void> {
  if (!requests.length) {
    return channels.error(null, ({ spec }) => spec('InvalidRequest'), send);
  }

  const promises: Array<Promise<RPCSingleResponse>> = [];
  const promist = new Promist<void>();
  let onall = Promise.resolve(promist);

  for (const request of requests) {
    if (validate.notification(request)) {
      handleNotification(request, channels);
    } else {
      promises.push(
        new Promise<RPCSingleResponse>((resolve, reject) => {
          try {
            if (!isValidRequest(request)) {
              return channels.error(
                hasNonNullId(request) ? request.id : null,
                ({ spec }) => spec('InvalidRequest'),
                resolve
              );
            }
            if (channels.exists(request.id)) {
              return channels.error(
                null,
                ({ spec }) => spec('InvalidRequest'),
                resolve
              );
            }
            if (!request.stream) {
              return handleUnary(request, context, channels, routes, resolve);
            }

            let first = true;
            handleStream(request, context, channels, routes, (data) => {
              if (first) {
                first = false;
                return validate.notification(data)
                  ? // :complete should never be the first response for a stream
                    channels.error(
                      request.id,
                      ({ spec }) => spec('InternalError'),
                      resolve
                    )
                  : resolve(data);
              } else {
                onall = onall.then(() => send(data));
              }
            });
          } catch (err) {
            reject(err);
          }
        })
      );
    }
  }

  await Promise.all(promises)
    .then((arr) => send(arr))
    .then(() => promist.resolve());
}
