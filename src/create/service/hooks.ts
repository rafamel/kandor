import { ServiceItem, InputHook, Service } from '~/types';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export function setServiceHooks<T extends Service>(
  service: ServiceItem<T>,
  hooks: InputHook | InputHook[]
): ServiceItem<T> {
  const arr = Array.isArray(hooks) ? hooks : [hooks];
  return arr.reduce((acc, hook) => setServiceHooks(acc, hook), service);
}

export function setServiceHook<T extends Service>(
  service: ServiceItem<T>,
  hook: InputHook
): ServiceItem<T> {
  const item = {
    ...service,
    types: {
      ...service.types,
      errors: [...(service.types.errors || [])]
    },
    service: {
      ...service.service,
      types: {
        ...service.service.types,
        errors: [...(service.service.types.errors || [])]
      }
    }
  };

  // Add errors
  if (hook.errors) {
    for (const error of hook.errors) {
      if (typeof error === 'string') item.service.types.errors.push(error);
      else item.types.errors.push(error);
    }
  }
  item.types.errors = item.types.errors.filter(
    (x, i, arr) => arr.indexOf(x) === i
  );
  item.service.types.errors = item.service.types.errors.filter(
    (x, i, arr) => arr.indexOf(x) === i
  );

  // Modify resolve
  const { before, after } = hook;
  if (before) {
    const resolvefn = item.service.resolve;
    item.service.resolve = async function resolve(data, context) {
      await before.call(hook, data, context);
      return resolvefn.call(service.service, data, context);
    };
  }
  if (after) {
    const resolvefn = item.service.resolve;
    if (service.kind !== 'subscription') {
      item.service.resolve = async function resolve(data, context) {
        const response: any = await resolvefn.call(
          service.service,
          data,
          context
        );
        return after.call(hook, response, context);
      };
    } else {
      item.service.resolve = async function resolve(data, context) {
        const observable: Observable<any> = await resolvefn.call(
          service.service,
          data,
          context
        );
        return observable.pipe(
          mergeMap((response) =>
            from((async () => await after.call(hook, response, context))())
          )
        );
      };
    }
  }

  return item;
}
