import { CollectionTreeImplementation } from '~/types';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublicError, CollectionError } from '~/errors';
import { error, intercepts, intercept } from '~/create';

export function addInterceptErrors(
  collection: CollectionTreeImplementation
): CollectionTreeImplementation {
  const errors = {
    ServerError: error({ code: 'ServerError' }),
    ClientError: error({ code: 'ClientError' })
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
