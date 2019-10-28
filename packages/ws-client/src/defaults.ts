import { WSClientOptionsOnly } from './types';

export function createDefaults(): Required<WSClientOptionsOnly> {
  return {
    attempts: 0,
    connectTimeout: 7500
  };
}
