import {
  ServiceItem,
  CollectionTree,
  InputService,
  ServiceItemTypes,
  ErrorCode,
  AppService
} from '~/types';

export function inputServiceToItem<T extends AppService>(
  kind: keyof Required<CollectionTree>['services'],
  service: InputService<T>
): ServiceItem<T> {
  const item = {
    kind,
    types: {} as ServiceItemTypes,
    service: {
      ...service,
      types: { ...service.types }
    }
  };

  if (typeof item.service.types.request !== 'string') {
    item.types.request = item.service.types.request;
    item.service.types.request = '';
  }
  if (typeof item.service.types.response !== 'string') {
    item.types.response = item.service.types.response;
    item.service.types.response = '';
  }
  if (item.service.types.errors && item.service.types.errors.length) {
    const errorStrings: string[] = [];
    const errorDefinitions: Array<{ name: string; code: ErrorCode }> = [];
    for (const error of item.service.types.errors) {
      if (typeof error === 'string') errorStrings.push(error);
      else errorDefinitions.push(error);
    }
    item.types.errors = errorDefinitions;
    item.service.types.errors = errorStrings;
  }

  return item as ServiceItem<T>;
}
