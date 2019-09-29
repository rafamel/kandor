import { InputService, AppService, FreeItem, FreeItemKind } from '~/types';
import camelcase from 'camelcase';
import { emptyTypes, isFreeItem } from '~/utils';
import uuid from 'uuid/v4';

const id = () => uuid().replace(/-/g, '');

export function inputServiceToItem<T extends AppService, N extends string>(
  name: N,
  kind: FreeItemKind<T>,
  service: InputService<T>
): FreeItem<T, N> {
  const item = {
    name,
    kind,
    types: { ...emptyTypes(), inline: emptyTypes() },
    item: {
      ...service,
      types: { ...service.types }
    }
  };

  const { request, response, errors } = item.item.types;
  const pascalName = camelcase(name, { pascalCase: true });
  if (request && typeof request !== 'string') {
    if (isFreeItem(request)) {
      item.item.types.request = request.name;
      item.types.request[request.name] = request.item;
    } else {
      const pascalRequestName = pascalName + 'Request-' + id();
      item.item.types.request = pascalRequestName;
      item.types.inline.request[pascalRequestName] = { schema: request };
    }
  }
  if (response && typeof response !== 'string') {
    if (isFreeItem(response)) {
      item.item.types.response = response.name;
      item.types.response[response.name] = response.item;
    } else {
      const pascalResponseName = pascalName + 'Response-' + id();
      item.item.types.response = pascalResponseName;
      item.types.inline.response[pascalResponseName] = {
        schema: response,
        children: { query: {}, subscription: {} }
      };
    }
  }
  if (errors && errors.length) {
    const errorStrings: string[] = [];

    for (const error of errors) {
      if (typeof error === 'string') {
        errorStrings.push(error);
      } else if (isFreeItem(error)) {
        errorStrings.push(error.name);
        item.types.error[error.name] = error.item;
      } else {
        const { name: errorName, ...other } = error;
        const pascalErrorName =
          pascalName + camelcase(errorName, { pascalCase: true }) + '-' + id();

        errorStrings.push(pascalErrorName);
        item.types.inline.error[pascalErrorName] = {
          ...other
        };
      }
    }
    item.item.types.errors = errorStrings;
  }

  return item as FreeItem<T, N>;
}
