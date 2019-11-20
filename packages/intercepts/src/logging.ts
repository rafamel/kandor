import {
  intercept,
  PublicError,
  InterceptImplementation,
  ServiceElementKind
} from '@karmic/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ensure } from 'errorish';
import { until } from 'promist';

export type LogStatus = 'success' | 'error' | 'complete' | 'unsubscribe';

export interface LogData {
  route: string;
  kind: ServiceElementKind;
  status: LogStatus;
  context: any;
  request: object;
  response: any;
  elapsed: number;
}

export interface LoggingOptions {
  /**
   * Won't call `logger` for statuses in the `skip` array. Default: `[]`.
   */
  skip?: LogStatus[];
  /**
   * `LogData` will lack keys in the `ignore` array. Default: `[]`.
   */
  ignore?: Array<keyof LogData>;
  /**
   * If `true`, thrown errors will be serialized into objects with enumerable properties. Default: `true`.
   */
  serializeErrors?: boolean;
}

/**
 * Returns an intercept that will call `logger` with a `LogData` object for each all service events.
 */
export function logging(
  logger: (data: Partial<LogData>) => void,
  options?: LoggingOptions
): InterceptImplementation<any, any, any> {
  const opts = Object.assign(
    { skip: [], ignore: [], serializeErrors: true },
    options
  );

  const fn = opts.ignore.length
    ? (data: LogData) => {
        for (const key of opts.ignore) {
          delete data[key];
        }
        return logger(data);
      }
    : logger;

  function serializeError(err: Error): object {
    if (!opts.serializeErrors) return err;
    err = ensure(err);
    return err instanceof PublicError
      ? {
          name: err.name,
          id: err.id,
          label: err.label,
          description: err.message,
          stack: err.stack,
          source: err.source
            ? {
                name: err.source.name,
                message: err.source.message,
                stack: err.source.stack
              }
            : null
        }
      : {
          name: err.name,
          message: err.message,
          stack: err.stack
        };
  }

  return intercept({
    factory: () => (data, context, info, next) => {
      const start = Date.now();
      const observable = next(data);
      const base = {
        kind: info.kind,
        route: info.route.join(':'),
        context,
        request: data
      };

      if (info.kind !== 'subscription') {
        return observable.pipe(
          tap({
            next: opts.skip.includes('success')
              ? () => {}
              : (value) =>
                  fn({
                    status: 'success',
                    ...base,
                    response: value,
                    elapsed: Date.now() - start
                  }),
            error: (error) =>
              opts.skip.includes('error')
                ? () => {}
                : fn({
                    status: 'error',
                    ...base,
                    response: serializeError(error),
                    elapsed: Date.now() - start
                  })
          })
        );
      }

      return new Observable((self) => {
        const subscription = observable.subscribe({
          next: opts.skip.includes('success')
            ? (value) => self.next(value)
            : (value) => {
                self.next(value);
                fn({
                  status: 'success',
                  ...base,
                  response: value,
                  elapsed: Date.now() - start
                });
              },
          error: opts.skip.includes('error')
            ? (err: Error) => {
                self.error(err);
                unsubscribe();
              }
            : (err: Error) => {
                self.error(err);
                unsubscribe();
                fn({
                  status: 'error',
                  ...base,
                  response: serializeError(err),
                  elapsed: Date.now() - start
                });
              },
          complete: opts.skip.includes('complete')
            ? () => {
                self.complete();
                unsubscribe();
              }
            : () => {
                self.complete();
                unsubscribe();
                fn({
                  status: 'complete',
                  ...base,
                  response: null,
                  elapsed: Date.now() - start
                });
              }
        });

        function unsubscribe(): void {
          until(() => Boolean(subscription), true).then(() => {
            return subscription.unsubscribe();
          });
        }

        return opts.skip.includes('unsubscribe')
          ? unsubscribe
          : () => {
              unsubscribe();
              fn({
                status: 'unsubscribe',
                ...base,
                response: null,
                elapsed: Date.now() - start
              });
            };
      });
    }
  });
}
