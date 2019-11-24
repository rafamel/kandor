/* eslint-disable no-dupe-class-members */
import {
  CollectionTreeUnion,
  ExceptionsRecordUnion,
  SchemasRecordUnion,
  ChildrenRecordUnion,
  ServicesRecordUnion,
  ScopesRecordUnion,
  InterceptImplementation,
  CollectionTreeImplementation,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  AbstractCollectionTree,
  CollectionTreeDeclaration
} from '~/types';
import { Element } from '../Element';
import {
  CollectionInput,
  CollectionMergeFn,
  CollectionInterceptOptions,
  CollectionInstance,
  ScopeCollection,
  ExtractScope,
  CollectionValidateOptions,
  CollectionLiftOptions,
  LiftCollection,
  CollectionFilterInputFn,
  CollectionImplementationInputFn
} from './definitions';
import { mergeCollection } from '~/transform/merge';
import { ReplaceInputFn, replace } from '~/transform/replace';
import { reference } from './helpers/reference';
import { PublicError } from '~/PublicError';
import { error } from './helpers/error';
import { intercept } from './helpers/intercept';
import { scope, extract } from './helpers/scope';
import { validate } from './helpers/validate';
import { TraverseInputFn, traverse } from '~/inspect/traverse';
import { lift } from './helpers/lift';
import { filter } from './helpers/filter';
import { toImplementation, toDeclaration, toUnary } from './helpers/to';

export class Collection<
  A extends ExceptionsRecordUnion = {},
  B extends SchemasRecordUnion = {},
  C extends ChildrenRecordUnion = {},
  D extends ServicesRecordUnion = {},
  E extends ScopesRecordUnion = {}
> extends Element<CollectionTreeUnion> {
  public static ensure<T extends CollectionTreeUnion>(
    collection: T
  ): CollectionInstance<T> {
    return collection instanceof Collection
      ? collection
      : new Collection(collection);
  }
  public static exceptions<T extends ExceptionsRecordUnion>(
    exceptions: T
  ): Collection<T, {}, {}, {}, {}> {
    return new Collection({ exceptions });
  }
  public static schemas<T extends SchemasRecordUnion>(
    schemas: T
  ): Collection<{}, T, {}, {}, {}> {
    return new Collection({ schemas });
  }
  public static children<T extends ChildrenRecordUnion>(
    children: T
  ): Collection<{}, {}, T, {}, {}> {
    return new Collection({ children });
  }
  public static services<T extends ServicesRecordUnion>(
    services: T
  ): Collection<{}, {}, {}, T, {}> {
    return new Collection({ services });
  }
  public static merge: CollectionMergeFn = function merge(
    collection?: CollectionTreeUnion,
    ...collections: any[]
  ): any {
    let tree = collection || new Collection();
    for (const item of collections) {
      tree = mergeCollection(tree, item);
    }
    return new Collection(tree);
  };
  public readonly exceptions: A;
  public readonly schemas: B;
  public readonly children: C;
  public readonly services: D;
  public readonly scopes: E;
  public constructor(collection?: CollectionInput<A, B, C, D, E>) {
    super('collection');

    if (!collection) collection = {};
    this.exceptions = (collection.exceptions || {}) as A;
    this.schemas = (collection.schemas || {}) as B;
    this.children = (collection.children || {}) as C;
    this.services = (collection.services || {}) as D;
    this.scopes = (collection.scopes || {}) as E;
  }
  public reference<N extends keyof A | keyof B | Array<keyof A | keyof B>>(
    names: N
  ): N extends string[] ? string[] : string;
  public reference<
    M extends 'exceptions' | 'schemas',
    N extends M extends 'exceptions'
      ? keyof A | Array<keyof A>
      : keyof B | Array<keyof B>
  >(mode: M, names: N): N extends string[] ? string[] : string;
  public reference(a: any, b?: any): string | string[] {
    return reference(this, a, b);
  }
  public error<K extends keyof A>(
    id: K & string,
    source?: Error | null,
    clear?: boolean
  ): PublicError {
    return error(this, id, source, clear);
  }
  public intercept<T extends CollectionTreeImplementation>(
    this: T,
    intercepts: InterceptImplementation | InterceptImplementation[],
    options?: CollectionInterceptOptions
  ): CollectionInstance<T> {
    return new Collection(intercept(this, intercepts, options));
  }
  public scope<N extends string>(
    name: N
  ): CollectionInstance<ScopeCollection<A, B, C, D, E, N>> {
    return new Collection(scope(this, name));
  }
  public extract<N extends keyof E>(
    name: N & string
  ): CollectionInstance<ExtractScope<A, B, C, E, N>> {
    return new Collection(extract(this, name));
  }
  public validate(
    options?: CollectionValidateOptions
  ): this is CollectionTreeImplementation {
    return validate(this, options);
  }
  public replace<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: AbstractCollectionTree<Q, M, S>,
    fn: ReplaceInputFn<Q, M, S>
  ): CollectionInstance<AbstractCollectionTree<Q, M, S>> {
    return new Collection(replace(this, fn as any));
  }
  public traverse<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(this: AbstractCollectionTree<Q, M, S>, cb: TraverseInputFn<Q, M, S>): void {
    return traverse(this, cb as any);
  }
  public lift(
    options?: CollectionLiftOptions
  ): CollectionInstance<LiftCollection<CollectionTreeUnion<A, B, C, D, E>>> {
    return new Collection(lift(this, options));
  }
  public filter<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: AbstractCollectionTree<Q, M, S>,
    fn: CollectionFilterInputFn<Q, M, S>
  ): CollectionInstance<AbstractCollectionTree<Q, M, S>> {
    return new Collection(filter(this, fn));
  }
  public toImplementation<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: AbstractCollectionTree<Q, M, S>,
    fn: CollectionImplementationInputFn
  ): CollectionInstance<CollectionTreeImplementation> {
    return new Collection(toImplementation(this, fn));
  }
  public toDeclaration(): CollectionInstance<CollectionTreeDeclaration> {
    return new Collection(toDeclaration(this));
  }
  public toUnary<Q extends QueryServiceUnion, M extends MutationServiceUnion>(
    this: AbstractCollectionTree<Q, M, SubscriptionServiceUnion>
  ): CollectionInstance<AbstractCollectionTree<Q, M, never>> {
    return new Collection(toUnary(this));
  }
  public element(): CollectionTreeUnion<A, B, C, D, E> {
    return {
      kind: this.kind,
      exceptions: this.exceptions,
      schemas: this.schemas,
      children: this.children,
      services: this.services,
      scopes: this.scopes
    };
  }
}
