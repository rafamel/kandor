import { Service } from '@karmic/core';
import { RPCAdapterOptions, RPCRequest } from '~/types';

export default function createAllow(
  options: Required<RPCAdapterOptions>
): (action?: RPCRequest['action']) => Array<Service['kind']> {
  return function allow(action) {
    switch (action) {
      case 'query': {
        return options.querySubscriptions
          ? ['query', 'subscription']
          : ['query'];
      }
      case 'mutate': {
        return ['mutation'];
      }
      case 'subscribe':
      case 'unsubscribe': {
        return ['subscription'];
      }
      default: {
        return [];
      }
    }
  };
}
