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
import { isEnvelope, mergeTypes, traverse, mergeEnvelopeTypes } from '~/utils';
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
      let collection = clone(envelope) as Envelope<
        T & CollectionTreeImplementation,
        N
      >;
      traverse(
        { tree: collection.item, deep: true, children: false },
        (element, path) => {
          const key = path.slice(-1)[0] || '';
          const elementEnvelope = hook({ name: key, item: element }, hooks);
          Object.assign(element, elementEnvelope.item);
          collection = mergeEnvelopeTypes(collection, elementEnvelope);
        }
      );
      return collection;
    }
    case 'query':
    case 'mutation':
    case 'subscription': {
      let service = clone(envelope) as Envelope<T & ServiceImplementation, N>;
      if (hooks.errors) {
        for (const error of hooks.errors) {
          if (typeof error === 'string') {
            service.item.types.errors.push(error);
          } else if (isEnvelope(error)) {
            service = mergeEnvelopeTypes(service, error);
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
      let response = clone(envelope) as Envelope<
        T & ResponseTypeImplementation,
        N
      >;

      const children = response.item.children;
      if (!children || !Object.keys(children).length) return response;

      for (const [key, child] of Object.entries(children)) {
        const childEnvelope = hook({ name: key, item: child }, hooks);
        children[key] = childEnvelope.item;
        response = mergeEnvelopeTypes(response, childEnvelope);
      }
      response.item.children = children;

      return response;
    }
    default: {
      throw Error(`Invalid item kind for Envelope`);
    }
  }
}
