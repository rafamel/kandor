import { RESTServerOptions } from './types';

export function createDefaults(): Required<
  Omit<RESTServerOptions, 'fallback'>
> {
  return {
    crud: true,
    children: true,
    subscriptions: true,
    declaration: true,
    envelope(error, data) {
      return error
        ? {
            status: 'error',
            error: {
              id: error.id,
              label: error.label,
              description: error.message || null
            }
          }
        : {
            status: 'success',
            data: data
          };
    }
  };
}
