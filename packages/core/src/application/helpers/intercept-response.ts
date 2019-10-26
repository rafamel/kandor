import { CollectionTreeImplementation } from '~/types';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublicError, CollectionError } from '~/errors';
import { error, intercepts, intercept } from '~/create';

export function addInterceptResponse(
  collection: CollectionTreeImplementation
): CollectionTreeImplementation {
  const errors = {
    ServerError: error({ label: 'ServerError' }),
    ClientError: error({ label: 'ClientError' })
  };

  const tree = {
    ...collection,
    types: { ...errors, ...collection.types }
  };

  return intercepts(
    tree,
    [
      intercept({
        errors: Object.keys(errors).reduce(
          (acc, key) => Object.assign(acc, { [key]: key }),
          {}
        ),
        factory: () => (data, context, info, next) => {
          return next(data).pipe(
            map((value) => (value === undefined ? null : value)),
            catchError((err) =>
              throwError(
                err instanceof PublicError
                  ? err
                  : new CollectionError(tree, 'ServerError')
              )
            )
          );
        }
      })
    ],
    { prepend: true }
  );
}
