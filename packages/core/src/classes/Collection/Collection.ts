/* eslint-disable no-dupe-class-members */
import {
  AbstractCollectionTree,
  CollectionTreeImplementation,
  InterceptImplementation,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  CollectionTreeUnion,
  TreeServicesUnion,
  TreeTypesUnion,
  TreeScopesUnion,
  AbstractElement,
  CollectionTreeDeclaration,
  ElementUnion
} from '~/types';
import {
  CollectionInterceptOptions,
  ScopeCollection,
  ExtractScope,
  CollectionCreateInput,
  CollectionMergeFn,
  CollectionLiftOptions,
  LiftCollection,
  CollectionFilterInputFn,
  CollectionToImplementationInputFn,
  CollectionValidateOptions
} from './definitions';
import { containsKey } from 'contains-key';
import { Element } from '../Element';
import camelcase from 'camelcase';
import { liftServiceTypes } from './helpers/lift';
import { subscribe } from 'promist';
import {
  validateTypes,
  validateServices,
  validateScopes
} from './helpers/validate';
import {
  isElementService,
  isServiceImplementation,
  isElementTree,
  isTreeCollection,
  isTreeImplementation,
  isElementType,
  isTypeResponse,
  isServiceSubscription
} from '~/inspect/is';
import { mergeCollection } from '~/transform/merge';
import { ReplaceInputFn, replace } from '~/transform/replace';
import { TraverseInputFn, traverse } from '~/inspect/traverse';

export class Collection<
  T extends CollectionTreeUnion = CollectionTreeUnion
> extends Element<T> {
  public static create<
    A extends TreeTypesUnion = {},
    B extends TreeServicesUnion = {},
    C extends TreeScopesUnion = {}
  >(
    collection?: CollectionCreateInput<A, B, C>
  ): Collection<CollectionTreeUnion<A, B, C>> {
    if (!collection) collection = {};

    return new Collection({
      kind: 'collection',
      types: collection.types || {},
      services: collection.services || {},
      scopes: collection.scopes || {}
    } as any);
  }
  /**
   * Returns a new `Collection` with services `services`.
   */
  public static services<T extends TreeServicesUnion>(
    services: T
  ): Collection<CollectionTreeUnion<{}, T, {}>> {
    return Collection.create({ services });
  }
  /**
   * Returns a new `collection` with types `types`.
   */
  public static types<T extends TreeTypesUnion>(
    types: T
  ): Collection<CollectionTreeUnion<T, {}, {}>> {
    return Collection.create({ types });
  }
  /**
   * Merges collections.
   */
  public static merge: CollectionMergeFn = function merge(
    collection?: CollectionTreeUnion,
    ...collections: any[]
  ): any {
    let tree = collection || Collection.create();
    for (const item of collections) {
      tree = mergeCollection(tree, item);
    }
    return new Collection(tree);
  };
  public readonly types: T['types'];
  public readonly services: T['services'];
  public readonly scopes: T['scopes'];
  public constructor(collection: T) {
    super(collection.kind);
    this.types = collection.types;
    this.services = collection.services;
    this.scopes = collection.scopes;
  }
  public reference<K extends keyof T['types']>(names: K[]): K[];
  public reference<K extends keyof T['types']>(name: K): K;
  /**
   * Returns `name`, as a *string* or a *string array*, while ensuring
   * types with `name`s exist on `collection`.
   * A helper to be used for type safety when referencing types on service creation.
   */
  public reference<K extends keyof T['types']>(names: K | K[]): K | K[] {
    const isArray = Array.isArray(names);
    const arr = isArray ? (names as K[]) : [names as K];

    for (const name of arr) {
      if (!containsKey(this.types, name)) {
        throw Error(`Can't reference "${name}" on collection`);
      }
    }

    return isArray ? arr : arr[0];
  }
  public intercept(
    this: Collection<CollectionTreeImplementation>,
    intercepts: InterceptImplementation | InterceptImplementation[],
    options?: CollectionInterceptOptions
  ): Collection<T> {
    const opts = Object.assign({ prepend: true }, options);
    const arr =
      intercepts && !Array.isArray(intercepts) ? [intercepts] : intercepts;

    return this.replace((element, info, next) => {
      element = next(element);

      return !isElementService(element) || !isServiceImplementation(element)
        ? element
        : {
            ...element,
            intercepts: opts.prepend
              ? arr.concat(element.intercepts || [])
              : (element.intercepts || []).concat(arr)
          };
    }) as Collection<T>;
  }
  /**
   * Returs a new collection with all of the services within the input collection in scope `name`.
   */
  public scope<
    A extends TreeTypesUnion,
    B extends TreeServicesUnion,
    C extends TreeScopesUnion,
    N extends string
  >(
    this: Collection<
      AbstractCollectionTree<
        QueryServiceUnion,
        MutationServiceUnion,
        SubscriptionServiceUnion,
        A,
        B,
        C
      >
    >,
    name: N
  ): Collection<ScopeCollection<A, B, C, N>> {
    return new Collection({
      kind: this.kind,
      types: this.types,
      scopes: {
        [name]: {
          kind: 'scope',
          services: this.services,
          scopes: this.scopes
        }
      }
    } as any);
  }
  /**
   * Given a collection with a scope `name`, returns a new collection with all of the services in the root scope of the input collection discarded, and scope `name` serving as the new collection root.
   */
  public extract<
    A extends TreeTypesUnion,
    C extends TreeScopesUnion,
    N extends string
  >(
    this: Collection<
      AbstractCollectionTree<
        QueryServiceUnion,
        MutationServiceUnion,
        SubscriptionServiceUnion,
        A,
        TreeServicesUnion,
        C
      >
    >,
    name: N & string
  ): Collection<ExtractScope<A, C, N>> {
    if (!containsKey(this.scopes, name)) {
      throw Error(`Collection doesn't have scope: ${name}`);
    }

    const { services, scopes } = this.scopes[name];
    return new Collection({
      kind: this.kind,
      types: this.types,
      services,
      scopes
    } as any);
  }
  // TODO: validate collection object (ajv)
  // TODO: children services must have a request schema equal or as a subset of the type they belong to
  /**
   * It will throw if a collection:
   * - Would produce conflicting type names upon `lift`.
   * - Contains references to non existent types.
   * - Contains services with types of the wrong kind.
   * - Has empty type, service, or scope names.
   * - Has type, service, or scope names with non word characters.
   * - Has type names starting with a lowercase letter.
   * - Has service or scope names starting with an uppercase letter.
   * - Has a scope name equal to a service of its parent.
   * @returns `true` if a collection is a `CollectionTreeImplementation`.
   */
  public validate(
    options?: CollectionValidateOptions
  ): this is Collection<CollectionTreeImplementation> {
    const opts = Object.assign({ as: null, skipReferences: false }, options);

    this.lift(opts).traverse((element, info, next) => {
      if (!isElementTree(element)) return;

      if (isTreeCollection(element)) validateTypes(element.types);
      validateServices(element.services);
      validateScopes(element.scopes, element.services);
      next();
    });

    const isImplementation = isTreeImplementation(this, true);
    if (opts.as) {
      if (opts.as === 'implementation' && !isImplementation) {
        throw Error(`Collection is not a implementation`);
      }
      if (opts.as === 'declaration' && isImplementation) {
        throw Error(`Collection is not a declaration`);
      }
    }

    return isImplementation;
  }
  /**
   * Performs a traversal, returning a new collection where `Element`s are substituted by the ones returned by `cb`. Alternative to `Collection.traverse`.
   */
  public replace<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: Collection<AbstractCollectionTree<Q, M, S>>,
    fn: ReplaceInputFn<Q, M, S>
  ): Collection<AbstractCollectionTree<Q, M, S>> {
    return new Collection(replace(this, fn as any));
  }
  /**
   * Performs a tree traversal. Alternative to `Collection.replace`.
   */
  public traverse<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: Collection<AbstractCollectionTree<Q, M, S>>,
    cb: TraverseInputFn<Q, M, S>
  ): void {
    return traverse(this, cb as any);
  }
  /**
   * Lifts inline schemas and errors to the top level of a collection, naming them according to their scope, service, and kind. It will throw if a collection:
   * - Produces conflicting type names.
   * - Contains references to non existent types.
   * - Contains services with types of the wrong kind.
   */
  public lift(options?: CollectionLiftOptions): Collection<LiftCollection<T>> {
    const opts = Object.assign({ skipReferences: false }, options);

    const transform = (str: string, _isExplicit: boolean): string => {
      return camelcase(str, { pascalCase: true });
    };

    const types = {
      source: this.types,
      lift: { ...this.types }
    };

    const result = {
      ...this.replace((element, { route }, next): any => {
        if (isElementTree(element)) return next(element);

        const name = transform(route[route.length - 1], true);

        if (isElementType(element)) {
          if (!isTypeResponse(element) || !element.children) {
            return element;
          }

          const response = { ...element, children: { ...element.children } };
          for (const [key, service] of Object.entries(element.children)) {
            response.children[key] = liftServiceTypes(
              name + transform(key, false),
              service,
              types,
              opts,
              transform
            ) as any;
          }
          return response;
        }

        if (isElementService(element)) {
          return liftServiceTypes(
            route.length > 1
              ? transform(route[route.length - 2], false) + name
              : name,
            element,
            types,
            opts,
            transform
          );
        }

        return element;
      }),
      types: types.lift
    };

    return new Collection(result as LiftCollection<T>);
  }
  /**
   * Performs a traversal, returning a new collection where `Element`s are deleted when `cb` returns false. Inline types cannot be filtered.
   */
  public filter<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: Collection<AbstractCollectionTree<Q, M, S>>,
    fn: CollectionFilterInputFn<Q, M, S>
  ): Collection<AbstractCollectionTree<Q, M, S>> {
    return this.replace((element, info, next) => {
      if (isElementTree(element)) {
        if (isTreeCollection(element)) {
          element = { ...element, types: { ...element.types } };
          for (const [key, value] of Object.entries(element.types)) {
            const path = info.path.concat(['types', key]);
            const route = info.route.concat([key]);
            if (!fn(value, { path, route })) {
              delete element.types[key];
            }
          }
        }
        element = { ...element, services: { ...element.services } };
        for (const [key, value] of Object.entries(element.services)) {
          const path = info.path.concat(['services', key]);
          const route = info.route.concat([key]);
          if (!fn(value, { path, route })) {
            delete element.services[key];
          }
        }
      } else if (
        isElementType(element) &&
        isTypeResponse(element) &&
        element.children
      ) {
        const children = { ...element.children };
        for (const [key, value] of Object.entries(children)) {
          const path = info.path.concat(['children', key]);
          const route = info.route.concat([key]);
          if (!fn(value, { path, route })) {
            delete children[key];
          }
        }
        element = { ...element, children };
      }

      return next(element);
    });
  }
  public toImplementation<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: Collection<AbstractCollectionTree<Q, M, S>>,
    fn: CollectionToImplementationInputFn
  ): Collection<CollectionTreeImplementation> {
    return this.replace((element, info, next) => {
      element = next(element);
      return isElementService(element)
        ? (fn(element, info) as AbstractElement<Q, M, S>)
        : element;
    }) as Collection<CollectionTreeImplementation>;
  }
  public toDeclaration(): Collection<CollectionTreeDeclaration> {
    return this.replace((element, info, next) => {
      element = next(element);
      if (isElementService(element) && isServiceImplementation(element)) {
        const { resolve, intercepts, ...service } = element;
        return service as ElementUnion;
      }
      return element;
    }) as Collection<CollectionTreeDeclaration>;
  }
  public toUnary<Q extends QueryServiceUnion, M extends MutationServiceUnion>(
    this: Collection<AbstractCollectionTree<Q, M, SubscriptionServiceUnion>>
  ): Collection<AbstractCollectionTree<Q, M, never>> {
    return this.replace((element, info, next): any => {
      element = next(element);

      if (!isElementService(element) || !isServiceSubscription(element)) {
        return element;
      }

      if (!isServiceImplementation(element)) {
        return { ...element, kind: 'query' };
      }

      const resolve: any = element.resolve;
      return {
        ...element,
        kind: 'query',
        resolve(...args: any): Promise<any> {
          return subscribe(resolve.apply(this, args));
        }
      };
    }) as Collection<AbstractCollectionTree<Q, M, never>>;
  }
  public element(): T {
    return {
      kind: this.kind,
      types: this.types,
      services: this.services,
      scopes: this.scopes
    } as T;
  }
}
