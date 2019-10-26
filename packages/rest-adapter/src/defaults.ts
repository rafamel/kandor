import { RESTAdapterOptions } from './types';

export function createDefaults(): Required<
  Omit<RESTAdapterOptions, 'default'>
> {
  return {
    crud: true,
    children: true,
    subscriptions: true,
    declaration: '/:declaration',
    context: () => ({}),
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
