import { RPCClientOptions } from './types';

export function defaultOptions(
  options?: RPCClientOptions | null
): Required<RPCClientOptions> {
  if (!options) options = {};
  const timeouts = options.timeouts || {};

  return {
    attempts: options.attempts ? Math.max(0, options.attempts) : 0,
    ...options,
    timeouts: {
      connect: Object.hasOwnProperty.call(timeouts, 'connect')
        ? Math.max(0, timeouts.connect || 0)
        : 7500,
      response: Object.hasOwnProperty.call(timeouts, 'response')
        ? Math.max(0, timeouts.response || 0)
        : 30000
    },
    policies: {
      subscribe: 'fail',
      unsubscribe: 'complete',
      ...options.policies
    }
  };
}
