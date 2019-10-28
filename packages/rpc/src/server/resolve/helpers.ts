import { validate } from '~/validate';
import { RPCRequest } from '~/types';

export function isNonNullId(item: any): item is string | number {
  return ['string', 'number'].includes(typeof item);
}

export function hasNonNullId(item: any): item is { id: string | number } {
  return item && typeof item === 'object' && isNonNullId(item.id);
}

export function isValidRequest(item: any): item is RPCRequest {
  return (
    validate.request(item) &&
    isNonNullId(item.id) &&
    (item.params === undefined || typeof item.params === 'object') &&
    (!Object.hasOwnProperty.call(item, 'stream') ||
      typeof (item as any).stream === 'boolean')
  );
}
