import { RPCClientOptions } from './types';
import { DataInput, DataOutput } from '~/types';

export function createDefaults(): Required<RPCClientOptions> {
  return {
    batch: true,
    responseTimeout: 30000,
    subscribePolicy: 'fail',
    unsubscribePolicy: 'complete',
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
