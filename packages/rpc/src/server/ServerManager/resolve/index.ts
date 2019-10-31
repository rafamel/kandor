import { ChannelManager } from '../ChannelManager';
import { ApplicationServices } from '@karmic/core';
import { RPCNotification, RPCResponse, DataInput } from '~/types';
import { resolveBatch, resolveSingle } from './resolve';
import { hasNonNullId } from './helpers';

export function resolve(
  data: DataInput,
  context: Promise<any>,
  channels: ChannelManager,
  routes: ApplicationServices,
  deserialize: (data: DataInput) => Promise<object>,
  fatal: (error: Error) => void,
  send: (data: RPCResponse | RPCNotification) => void
): void {
  deserialize(data)
    .then((request) => {
      return context
        .then(async (context) => {
          try {
            Array.isArray(request)
              ? await resolveBatch(request, context, channels, routes, send)
              : resolveSingle(request, context, channels, routes, send);
          } catch (err) {
            fatal(err);
          }
        })
        .catch((err: Error) => {
          return channels.error(
            hasNonNullId(request) ? request.id : null,
            ({ core }) => core(err),
            send
          );
        });
    })
    .catch(() => {
      return channels.error(null, ({ spec }) => spec('ParseError'), send);
    });
}
