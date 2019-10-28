import { RPCServerOptions } from './types';
import { DataOutput, DataInput } from '~/types';

export function createDefaults(): Required<Omit<RPCServerOptions, 'default'>> {
  return {
    children: true,
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
