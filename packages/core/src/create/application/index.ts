import {
  CollectionTreeApplication,
  CollectionTree,
  TreeTypes,
  CreateApplicationOptions,
  GenericError,
  ErrorType
} from '~/types';
import clone from 'lodash.clonedeep';
import { traverse, isElementType } from '~/utils';
import camelcase from 'camelcase';
import serviceIntercepts from './service-intercepts';
import { mergeServiceTypes } from './merge';
import { intercepts, intercept } from '../intercepts';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublicError, CollectionError } from '~/errors';
import { error } from '../types';

// TODO: validate collection object (ajv) + check schemas are valid
// TODO: adapters rely on resolve() existing on all services. Separate normalization from application?

/**
 * Returns a new object instance of a collection; prepares a collection to be used by an adapter:
 * - Pipes all services intercepts with their resolve function and merges their error types.
 * - Ensures all services throw with a `PublicError`.
 * - Checks for non-existent type references and references of the wrong kind.
 * - Moves all inline types to `CollectionTree.types`.
 */
export default function application(
  collection: CollectionTree,
  options?: CreateApplicationOptions
): CollectionTreeApplication {
  const opts = Object.assign(
    {
      prefixScope: true,
      prefixInlineError: false,
      transform: (str: string) => camelcase(str, { pascalCase: true })
    },
    options
  );

  // clone collection and add global errors
  collection = clone(collection);
  const errors: {
    [P in GenericError]: ErrorType;
  } = {
    ServerError: error({ code: 'ServerError' }),
    ClientError: error({ code: 'ClientError' })
  };
  for (const [name, error] of Object.entries(errors)) {
    if (!collection.types[name]) {
      collection.types[name] = error;
    }
  }

  const internal: GenericError = 'ServerError';
  collection = intercepts(
    collection,
    [
      intercept({
        errors: Object.keys(errors).reduce(
          (acc, key) => Object.assign(acc, { [key]: key }),
          {}
        ),
        factory: () => (data, context, next) => {
          return next(data).pipe(
            catchError((err) =>
              throwError(
                err instanceof PublicError
                  ? err
                  : new CollectionError(collection, internal)
              )
            )
          );
        }
      })
    ],
    { prepend: true }
  );

  const types = {
    source: collection.types,
    application: Object.entries(collection.types).reduce(
      (acc: TreeTypes, [name, type]) => {
        const pascal = opts.transform(name, true);
        if (Object.hasOwnProperty.call(acc, pascal)) {
          throw Error(`Type name collision: ${pascal}`);
        }
        acc[pascal] = type;
        return acc;
      },
      {}
    )
  };

  traverse(
    collection,
    { deep: true, children: false, inline: false },
    (element, path) => {
      const name = opts.transform(path.slice(-1)[0], true);

      if (isElementType(element)) {
        if (element.kind !== 'response' || !element.children) return;
        for (const [key, service] of Object.entries(element.children)) {
          const fullName = name + opts.transform(key, false);
          serviceIntercepts(fullName, service, types.source);
          mergeServiceTypes(fullName, service, types, opts);
        }
      } else {
        const fullName =
          opts.prefixScope && path[path.length - 3]
            ? opts.transform(path[path.length - 3], false) + name
            : name;

        serviceIntercepts(fullName, element, types.source);
        mergeServiceTypes(fullName, element, types, opts);
      }
    }
  );

  return {
    ...collection,
    types: types.application
  } as CollectionTreeApplication;
}
