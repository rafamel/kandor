import {
  EnvelopeElement,
  Envelope,
  InputHook,
  ServiceImplementation,
  Observable,
  ResponseTypeImplementation,
  CollectionTreeImplementation
} from '~/types';
import clone from 'lodash.clonedeep';
import { isEnvelope, mergeTypes, traverse } from '~/utils';
import camelcase from 'camelcase';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export default function hook<T extends EnvelopeElement, N extends string>(
  envelope: Envelope<T, N>,
  hooks: InputHook | InputHook[]
): Envelope<T, N> {
  if (Array.isArray(hooks)) {
    return hooks.reverse().reduce((acc, fn) => hook(acc, fn), envelope);
  }

  switch (envelope.item.kind) {
    case 'collection': {
      const collection = clone(envelope) as Envelope<
        T & CollectionTreeImplementation,
        N
      >;
      traverse(
        { tree: collection.item, deep: true, children: false },
        (element, path) => {
          const key = path.slice(-1)[0] || '';
          const elementEnvelope = hook({ name: key, item: element }, hooks);
          Object.assign(element, elementEnvelope.item);
          if (elementEnvelope.types) {
            collection.types = mergeTypes(
              collection.types || {},
              elementEnvelope.types
            );
          }
          if (elementEnvelope.inline) {
            collection.inline = mergeTypes(
              collection.inline || {},
              elementEnvelope.inline
            );
          }
        }
      );
      return collection;
    }
    case 'query':
    case 'mutation':
    case 'subscription': {
      const service = clone(envelope) as Envelope<T & ServiceImplementation, N>;
      if (hooks.errors) {
        for (const error of hooks.errors) {
          if (typeof error === 'string') {
            service.item.types.errors.push(error);
          } else if (isEnvelope(error)) {
            if (error.types) {
              service.types = mergeTypes(service.types || {}, error.types);
            }
            if (error.inline) {
              service.inline = mergeTypes(service.inline || {}, error.inline);
            }
            service.types = mergeTypes(service.types || {}, {
              [error.name]: error.item
            });
            service.item.types.errors.push(error.name);
          } else {
            const name = camelcase(error.name, { pascalCase: true });
            service.inline = mergeTypes(service.inline || {}, {
              [name]: { kind: 'error', code: error.code }
            });
            service.item.types.errors.push(name);
          }
        }
      }
      if (hooks.before) {
        const beforeFn = hooks.before;
        const resolveFn = service.item.resolve;
        service.item.resolve = async function resolve(...args: any[]) {
          await beforeFn.apply(this, args as any);
          return resolveFn.apply(this, args as any);
        };
      }
      if (hooks.after) {
        const afterFn = hooks.after;
        const resolveFn = service.item.resolve;
        if (service.item.kind !== 'subscription') {
          service.item.resolve = async function resolve(...args: any[]) {
            const response = await resolveFn.apply(this, args as any);
            await afterFn.apply(this, [response].concat(args.slice(1)) as any);
            return response;
          };
        } else {
          service.item.resolve = async function resolve(...args: any[]) {
            const observable: Observable<any> = await resolveFn.apply(
              this,
              args as any
            );
            return observable.pipe(
              mergeMap((response) => {
                const fn = async (): Promise<typeof response> => {
                  await afterFn.apply(this, [response].concat(
                    args.slice(1)
                  ) as any);
                  return response;
                };
                return from(fn());
              })
            );
          };
        }
      }
      return service;
    }
    case 'error':
    case 'request': {
      return envelope;
    }
    case 'response': {
      const response = clone(envelope) as Envelope<
        T & ResponseTypeImplementation,
        N
      >;

      if (!response.item.children) return response;

      const childrenKeys = Object.keys(response.item.children);
      for (const childKey of childrenKeys) {
        const child = response.item.children[childKey];
        const childEnvelope = hook({ name: childKey, item: child }, hooks);
        response.item.children[childKey] = childEnvelope.item;
        if (childEnvelope.types) {
          response.types = mergeTypes(
            response.types || {},
            childEnvelope.types
          );
        }
        if (childEnvelope.inline) {
          response.inline = mergeTypes(
            response.inline || {},
            childEnvelope.inline
          );
        }
      }
      return response;
    }
    default: {
      throw Error(`Invalid item kind for Envelope`);
    }
  }
}
