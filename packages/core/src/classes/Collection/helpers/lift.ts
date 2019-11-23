import {
  InterceptImplementation,
  ServiceUnion,
  SchemasRecordUnion,
  CollectionTreeUnion,
  ExceptionsRecordUnion,
  ChildrenUnion,
  ChildrenSchemasUnion,
  ServiceExceptionsUnion,
  SchemaUnion,
  ExceptionUnion
} from '~/types';
import isequal from 'lodash.isequal';
import { containsKey } from 'contains-key';
import { CollectionLiftOptions, LiftCollection } from '../definitions';
import {
  isServiceImplementation,
  isElementTree,
  isElementService,
  isElementChildren
} from '~/inspect/is';
import camelcase from 'camelcase';
import { replace } from '~/transform/replace';
import { item } from '~/utils/item';

interface Destination {
  exceptions: ExceptionsRecordUnion;
  schemas: SchemasRecordUnion;
}

type Transform = (str: string, isExplicit: boolean) => string;

/**
 * Lifts inline schemas and exceptions to the top level of a collection, naming them according to their scope, service, and role. It will throw if a collection:
 * - Produces conflicting names.
 * - Contains references to non existent schemas or exceptions.
 */
export function lift<T extends CollectionTreeUnion>(
  collection: T,
  options?: CollectionLiftOptions
): LiftCollection<T> {
  const opts = Object.assign({ skipReferences: false }, options);

  const transform: Transform = (str) => {
    return camelcase(str, { pascalCase: true });
  };

  const destination: Destination = {
    exceptions: { ...collection.exceptions },
    schemas: { ...collection.schemas }
  };

  const result: CollectionTreeUnion = replace(
    collection,
    (element, { path, route }, next): any => {
      if (isElementTree(element)) return next(element);

      const name = transform(path[path.length - 1], true);

      if (isElementService(element)) {
        if (!route) throw Error(`Expected route for path: ${path}`);
        return liftService(
          route.length > 1
            ? transform(route[route.length - 2], false) + name
            : name,
          element,
          destination,
          opts,
          transform
        );
      }

      if (isElementChildren(element)) {
        if (!route) throw Error(`Expected route for path: ${path}`);
        return liftChildren(name, element, destination, opts, transform);
      }

      return element;
    }
  );

  return { ...result, ...destination } as LiftCollection<T>;
}

export function liftChildren<T extends ChildrenUnion>(
  name: string,
  children: T,
  destination: Destination,
  options: Required<CollectionLiftOptions>,
  transform: Transform
): T {
  const schemas = liftSchemas(children.schemas, destination, options);

  const services = { ...children.services };
  for (const [key, service] of Object.entries(services)) {
    services[key] = liftService(
      name + transform(key, false),
      service,
      destination,
      options,
      transform
    );
  }
  return { ...children, schemas, services };
}

export function liftService<T extends ServiceUnion>(
  name: string,
  service: T,
  destination: Destination,
  options: Required<CollectionLiftOptions>,
  transform: Transform
): T {
  const exceptions = liftExceptions(service.exceptions, destination, options);

  const [request, response] = liftSchemas(
    [
      typeof service.request === 'string'
        ? service.request
        : item(name + transform('Request', false), service.request),
      typeof service.response === 'string'
        ? service.response
        : item(name + transform('Response', false), service.response)
    ],
    destination,
    options
  );

  if (
    isServiceImplementation(service) &&
    service.intercepts &&
    service.intercepts.length
  ) {
    const intercepts: InterceptImplementation[] = [];
    for (const intercept of service.intercepts) {
      intercepts.push({
        ...intercept,
        exceptions: liftExceptions(intercept.exceptions, destination, options)
      });
    }

    return { ...service, exceptions, request, response, intercepts };
  }

  return { ...service, exceptions, request, response };
}

export function liftExceptions(
  exceptions: ServiceExceptionsUnion,
  destination: Destination,
  options: Required<CollectionLiftOptions>
): string[] {
  const result: string[] = [];

  for (const exception of exceptions) {
    if (typeof exception === 'string') {
      assertReferenceExists(exception, 'exceptions', destination, options);
      result.push(exception);
    } else {
      liftException(exception.name, exception.item, destination);
      result.push(exception.name);
    }
  }

  return result;
}

export function liftException(
  name: string,
  exception: ExceptionUnion,
  destination: Destination
): void {
  // In the case of errors we'll check for deep equality.
  // This is specially important for intercepts, which might
  // make inline declarations repeat themselves.
  if (
    containsKey(destination.exceptions, name) &&
    !isequal(destination.exceptions[name], exception)
  ) {
    throw Error(`Inline exception name collision: ${name}`);
  }
  destination.exceptions[name] = exception;
}

export function liftSchemas(
  schemas: ChildrenSchemasUnion,
  destination: Destination,
  options: Required<CollectionLiftOptions>
): string[] {
  const result: string[] = [];

  for (const schema of schemas) {
    if (typeof schema === 'string') {
      assertReferenceExists(schema, 'schemas', destination, options);
      result.push(schema);
    } else {
      liftSchema(schema.name, schema.item, destination);
      result.push(schema.name);
    }
  }

  return result;
}

export function liftSchema(
  name: string,
  schema: SchemaUnion,
  destination: Destination
): void {
  if (containsKey(destination.schemas, name) as boolean) {
    throw Error(`Inline schema name collision: ${name}`);
  }
  destination.schemas[name] = schema;
}

export function assertReferenceExists(
  name: string,
  type: 'schemas' | 'exceptions',
  destination: Destination,
  options: Required<CollectionLiftOptions>
): void {
  const skip =
    options.skipReferences &&
    (typeof options.skipReferences === 'boolean' ||
      options.skipReferences.includes(name));

  if (!skip && !containsKey(destination[type], name)) {
    throw Error(`Collection lacks ${type} reference: ${name}`);
  }
}
