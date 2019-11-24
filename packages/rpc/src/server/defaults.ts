import { RPCServerOptions } from './types';
import { DataOutput, DataInput } from '~/types';
import { Exception } from '@karmic/core';

export function createDefaults(): Required<Omit<RPCServerOptions, 'fallback'>> {
  return {
    children: true,
    complete: {
      name: 'EarlyCompleteError',
      item: new Exception({ label: 'ServerError' })
    },
    parser: {
      serialize(data: object): DataOutput {
        return JSON.stringify(data);
      },
      deserialize(data: DataInput): object {
        return JSON.parse(String(data));
      }
    }
  };
}
