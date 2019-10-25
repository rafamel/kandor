import {
  InterceptImplementation,
  intercept,
  ErrorTypeImplementation,
  error,
  ServiceErrorsImplementation,
  PublicError
} from '@karmic/core';
import Ajv from 'ajv';
import draft04 from 'ajv/lib/refs/json-schema-draft-04.json';
import { switchMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

export interface ValidationOptions {
  /**
   * If `false`, it won't validate requests.
   * If `true`, it will validate requests and use a default `ValidationError` to fail.
   * If a `ValidationError` is passed, it will be used to fail instead.
   * Default: `true`.
   */
  request?: ValidationError | boolean;
  /**
   * If `false`, it won't validate responses.
   * If `true`, it will validate responses and use a default `ValidationError` to fail.
   * If a `ValidationError` is passed, it will be used to fail instead.
   * Default: `false`.
   */
  response?: ValidationError | boolean;
}

export interface ValidationError {
  name: string;
  type: ErrorTypeImplementation;
}

const ajv = new Ajv({ schemaId: 'id', logger: false });
ajv.addMetaSchema(draft04);

/**
 * Returns an intercept that will validate incoming request objects and/or outgoing responses.
 */
export function validation(
  options?: ValidationOptions
): InterceptImplementation<any, any, any> {
  const opts = Object.assign({ request: true, response: false }, options);

  const requestError: ValidationError | null = opts.request
    ? opts.request === true
      ? {
          name: 'RequestValidationError',
          type: error({ code: 'ClientError' })
        }
      : opts.request
    : null;
  const responseError: ValidationError | null = opts.response
    ? opts.response === true
      ? {
          name: 'ResponseValidationError',
          type: error({ code: 'ServerError' })
        }
      : opts.response
    : null;

  return intercept({
    errors: [requestError, responseError].reduce(
      (acc: ServiceErrorsImplementation, error) => {
        if (error) acc[error.name] = error.type;
        return acc;
      },
      {}
    ),
    factory: (schemas) => {
      const validateRequest = ajv.compile(schemas.request);
      const validateResponse = ajv.compile(schemas.response);
      return (data, context, info, next) => {
        if (requestError) {
          const valid = validateRequest(data);
          if (!valid) {
            throw new PublicError(
              requestError.name,
              requestError.type.code,
              null,
              requestError.type.description,
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
                        responseError.type.code,
                        null,
                        responseError.type.description,
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
