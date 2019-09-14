import { Schema } from '~/types';

export default function schema<T extends Schema>(json: T): T {
  return { type: json.type || 'object', ...json };
}
