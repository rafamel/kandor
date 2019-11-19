import {
  InterceptImplementation,
  intercept,
  error,
  ServiceErrorsImplementation,
  PublicError,
  ElementItem,
  ErrorType,
  ErrorTypeImplementation,
  item,
  validator
} from '@karmic/core';
import { switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

export interface ValidationOptions {
  /**
   * If `false`, it won't validate requests.
   * If `true`, it will validate requests and use a default `ValidationError` to fail.
   * If a `ValidationError` is passed, it will be used to fail instead.
   * Default: `true`.
   */
  request?: ElementItem<ErrorType<'ClientInvalid'>> | boolean;
  /**
   * If `false`, it won't validate responses.
   * If `true`, it will validate responses and use a default `ValidationError` to fail.
   * If a `ValidationError` is passed, it will be used to fail instead.
   * Default: `false`.
   */
  response?: ElementItem<ErrorType> | boolean;
}

/**
 * Returns an intercept that will validate incoming request objects and/or outgoing responses.
 */
export function validation(
  options?: ValidationOptions
): InterceptImplementation<any, any, any> {
  const opts = Object.assign({ request: true, response: false }, options);

  const requestError: ElementItem<ErrorTypeImplementation> | null = opts.request
    ? opts.request === true
      ? item('RequestValidationError', error({ label: 'ClientInvalid' }))
      : opts.request
    : null;
  const responseError: ElementItem<
    ErrorTypeImplementation
  > | null = opts.response
    ? opts.response === true
      ? item('ResponseValidationError', error({ label: 'ServerError' }))
      : opts.response
    : null;

  const errors: ServiceErrorsImplementation = [];
  if (requestError) {
    if (requestError.item.label !== 'ClientInvalid') {
      throw Error(
        `Request error must have label ClientInvalid: ${requestError.item.label}`
      );
    }
    errors.push(requestError);
  }
  if (responseError) errors.push(responseError);

  return intercept({
    errors,
    factory: (schemas) => {
      const validateRequest = validator.compile(schemas.request);
      const validateResponse = validator.compile(schemas.response);
      return (data, context, info, next) => {
        if (requestError) {
          const valid = validateRequest(data);
          if (!valid) {
            throw new PublicError(
              requestError.name,
              requestError.item.label,
              null,
              requestError.item.description,
              true
            );
          }
        }
        return responseError
          ? next(data).pipe(
              switchMap((value) => {
                const valid = validateResponse(value);
                return valid
                  ? of(value)
                  : throwError(
                      new PublicError(
                        responseError.name,
                        responseError.item.label,
                        null,
                        responseError.item.description,
                        true
                      )
                    );
              })
            )
          : next(data);
      };
    }
  });
}
