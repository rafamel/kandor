import { CollectionTreeImplementation } from '~/types';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PublicError, CollectionError } from '~/errors';
import { Type } from '../../Type';
import { Collection } from '../../Collection';
import { Intercept } from '../../Intercept';

export function addInterceptResponse(
  collection: Collection<CollectionTreeImplementation>
): Collection<CollectionTreeImplementation> {
  const errors = {
    ServerError: Type.error({ label: 'ServerError' }),
    ClientError: Type.error({ label: 'ClientError' })
  };

  const tree = Collection.create({
    ...collection,
    types: { ...errors, ...collection.types }
  });

  return tree.intercept(
    [
      Intercept.create({
        errors: Object.keys(errors),
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
