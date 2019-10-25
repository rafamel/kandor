import { RPCRequest } from './types';
import ChannelMananger from './ChannelManager';
import {
  Service,
  isServiceQuery,
  isServiceMutation,
  isServiceSubscription,
  ApplicationService
} from '@karmic/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export default function resolve(
  request: Partial<RPCRequest> & Pick<RPCRequest, 'id'>,
  promise: Promise<any>,
  channels: ChannelMananger,
  routes: (route: string) => void | ApplicationService,
  allow: (action?: RPCRequest['action']) => Array<Service['kind']>
): void {
  const { id, route, action, data } = { ...request };

  const allowed = allow(action);
  if (!allowed.length) {
    return channels.error(id, 'ClientError');
  }

  if (action === 'unsubscribe') {
    if (!channels.exists(id) || !channels.isSubscription(id)) {
      return channels.error(id, 'ClientError');
    }
    return channels.close(id, true);
  }

  if (!route) return channels.error(id, 'RouteError');
  const service = routes(route);
  if (!service || !allowed.includes(service.declaration.kind)) {
    return channels.error(id, 'RouteError');
  }

  if (channels.exists(id)) {
    return channels.error(id, 'ClientError');
  }

  promise
    .then((context) => {
      if (isServiceQuery(service.declaration) && action === 'query') {
        return channels.open(id, service.resolve(data || {}, context));
      }
      if (isServiceMutation(service.declaration) && action === 'mutate') {
        return channels.open(id, service.resolve(data || {}, context));
      }
      if (isServiceSubscription(service.declaration)) {
        if (action === 'query') {
          const obs = service.resolve(data || {}, context) as Observable<any>;
          return channels.open(id, obs.pipe(take(1)).toPromise());
        }
        if (action === 'subscribe') {
          return channels.open(id, service.resolve(data || {}, context));
        }
      }
      return channels.error(id, 'ServerError');
    })
    .catch((err) => {
      channels.close(id);
      return channels.error(id, err);
    });
}
