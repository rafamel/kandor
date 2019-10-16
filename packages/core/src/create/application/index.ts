import { CollectionTree, ApplicationCollection } from '~/types';
import serviceIntercepts from './service-intercepts';
import { intercepts, intercept } from '../intercepts';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublicError, CollectionError } from '~/errors';
import { error } from '../types';
import { isElementService, validate, isServiceImplementation } from '~/inspect';
import { replace } from '~/transform';

/**
 * Validates and prepares a collection to be used by an adapter. Returns a new collection with:
 * - `ServerError` and `ClientError` error types, if non existent, for internal usage.
 * - All of its services errors rethrown as a `PublicError`s, if they're not already one, for `CollectionImplementation`s.
 * - Intercepts merged into their services, for `CollectionImplementation`s.
 */
export function application<T extends CollectionTree>(
  collection: T
): ApplicationCollection<T> {
  // adds global errors
  const errors = {
    ServerError: error({ code: 'ServerError' }),
    ClientError: error({ code: 'ClientError' })
  };
  let application: ApplicationCollection<T> = {
    ...collection,
    types: {
      ...errors,
      ...collection.types
    }
  };

  // if not an implementation, return as is
  if (!validate(application)) return application;

  application = intercepts(
    application,
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
                  : new CollectionError(application, 'ServerError')
              )
            )
          );
        }
      })
    ],
    { prepend: true }
  );

  return replace(application, (element, next) => {
    element = next(element);
    return isElementService(element) && isServiceImplementation(element)
      ? serviceIntercepts(element, application)
      : element;
  }) as ApplicationCollection<T>;
}
