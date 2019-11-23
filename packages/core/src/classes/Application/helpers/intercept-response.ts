import { CollectionTreeImplementation } from '~/types';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Collection } from '../../Collection';
import { Intercept } from '../../Intercept';
import { Exception } from '../../Exception';
import { PublicError } from '~/PublicError';

export function addInterceptResponse(
  collection: Collection<CollectionTreeImplementation>
): Collection<CollectionTreeImplementation> {
  const errors = {
    ServerError: Exception.create({ label: 'ServerError' }),
    ClientError: Exception.create({ label: 'ClientError' })
  };

  const tree = Collection.merge(collection, Collection.exceptions(errors));
  return tree.intercept(
    [
      Intercept.create({
        exceptions: Object.keys(errors),
        factory: () => (data, context, info, next) => {
          return next(data).pipe(
            map((value) => (value === undefined ? null : value)),
            catchError((err) =>
              throwError(
                err instanceof PublicError ? err : tree.error('ServerError')
              )
            )
          );
        }
      })
    ],
    { prepend: true }
  );
}
