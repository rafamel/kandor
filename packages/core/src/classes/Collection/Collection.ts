/* eslint-disable no-dupe-class-members */
import {
  AbstractCollectionTree,
  CollectionTreeImplementation,
  InterceptImplementation,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  CollectionTreeUnion,
  CollectionTreeDeclaration,
  ExceptionsRecordUnion,
  SchemasRecordUnion,
  ChildrenRecordUnion,
  ScopesRecordUnion,
  ServicesRecordUnion
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
  CollectionValidateOptions,
  CollectionImplementationInputFn
} from './definitions';
import { Element } from '../Element';
import { lift } from './helpers/lift';
import { validate } from './helpers/validate';
import { mergeCollection } from '~/transform/merge';
import { ReplaceInputFn, replace } from '~/transform/replace';
import { TraverseInputFn, traverse } from '~/inspect/traverse';
import { intercept } from './helpers/intercept';
import { filter } from './helpers/filter';
import { toImplementation, toDeclaration, toUnary } from './helpers/to';
import { extract, scope } from './helpers/scope';
import { create } from './helpers/create';
import { reference } from './helpers/reference';
import { error } from './helpers/error';
import { PublicError } from '~/PublicError';

export class Collection<
  T extends CollectionTreeUnion = CollectionTreeUnion
> extends Element<T> {
  public static create<
    A extends ExceptionsRecordUnion = {},
    B extends SchemasRecordUnion = {},
    C extends ChildrenRecordUnion = {},
    D extends ServicesRecordUnion = {},
    E extends ScopesRecordUnion = {}
  >(
    collection?: CollectionCreateInput<A, B, C, D, E>
  ): Collection<CollectionTreeUnion<A, B, C, D, E>> {
    return new Collection(create(collection));
  }
  public static exceptions<T extends ExceptionsRecordUnion>(
    exceptions: T
  ): Collection<CollectionTreeUnion<T, {}, {}, {}, {}>> {
    return Collection.create({ exceptions });
  }
  public static schemas<T extends SchemasRecordUnion>(
    schemas: T
  ): Collection<CollectionTreeUnion<{}, T, {}, {}, {}>> {
    return Collection.create({ schemas });
  }
  public static children<T extends ChildrenRecordUnion>(
    children: T
  ): Collection<CollectionTreeUnion<{}, {}, T, {}, {}>> {
    return Collection.create({ children });
  }
  public static services<T extends ServicesRecordUnion>(
    services: T
  ): Collection<CollectionTreeUnion<{}, {}, {}, T, {}>> {
    return Collection.create({ services });
  }
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
  public readonly exceptions: T['exceptions'];
  public readonly schemas: T['schemas'];
  public readonly children: T['children'];
  public readonly services: T['services'];
  public readonly scopes: T['scopes'];
  public constructor(collection: T) {
    super(collection.kind);
    this.exceptions = collection.exceptions;
    this.schemas = collection.schemas;
    this.children = collection.children;
    this.services = collection.services;
    this.scopes = collection.scopes;
  }
  public reference<
    C extends CollectionTreeUnion,
    N extends
      | keyof C['exceptions']
      | keyof C['schemas']
      | Array<keyof C['exceptions'] | keyof C['schemas']>
  >(this: C, names: N): N extends string[] ? string[] : string;
  public reference<
    C extends CollectionTreeUnion,
    M extends 'exceptions' | 'schemas',
    N extends keyof C[M] | Array<keyof C[M]>
  >(this: C, mode: M, names: N): N extends string[] ? string[] : string;
  public reference(a: any, b?: any): string | string[] {
    return reference(this, a, b);
  }
  public error<C extends CollectionTreeUnion, K extends keyof C['exceptions']>(
    this: C,
    id: K & string,
    source?: Error | null,
    clear?: boolean
  ): PublicError {
    return error(this, id, source, clear);
  }
  public intercept(
    this: CollectionTreeImplementation & T,
    intercepts: InterceptImplementation | InterceptImplementation[],
    options?: CollectionInterceptOptions
  ): Collection<T> {
    return new Collection(intercept(this, intercepts, options));
  }
  public scope<
    A extends ExceptionsRecordUnion,
    B extends SchemasRecordUnion,
    C extends ChildrenRecordUnion,
    D extends ServicesRecordUnion,
    E extends ScopesRecordUnion,
    N extends string
  >(
    this: AbstractCollectionTree<
      QueryServiceUnion,
      MutationServiceUnion,
      SubscriptionServiceUnion,
      A,
      B,
      C,
      D,
      E
    >,
    name: N
  ): Collection<ScopeCollection<A, B, C, D, E, N>> {
    return new Collection(scope(this, name));
  }
  public extract<
    A extends ExceptionsRecordUnion,
    B extends SchemasRecordUnion,
    C extends ChildrenRecordUnion,
    E extends ScopesRecordUnion,
    N extends keyof E
  >(
    this: AbstractCollectionTree<
      QueryServiceUnion,
      MutationServiceUnion,
      SubscriptionServiceUnion,
      A,
      B,
      C,
      ServicesRecordUnion,
      E
    >,
    name: N & string
  ): Collection<ExtractScope<A, B, C, E, N>> {
    return new Collection(extract(this, name));
  }
  public validate(
    options?: CollectionValidateOptions
  ): this is Collection<CollectionTreeImplementation> {
    return validate(this, options);
  }
  public replace<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: AbstractCollectionTree<Q, M, S>,
    fn: ReplaceInputFn<Q, M, S>
  ): Collection<AbstractCollectionTree<Q, M, S>> {
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
    this: CollectionTreeUnion & T,
    options?: CollectionLiftOptions
  ): Collection<LiftCollection<T>> {
    return new Collection(lift(this, options));
  }
  public filter<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: AbstractCollectionTree<Q, M, S>,
    fn: CollectionFilterInputFn<Q, M, S>
  ): Collection<AbstractCollectionTree<Q, M, S>> {
    return new Collection(filter(this, fn));
  }
  public toImplementation<
    Q extends QueryServiceUnion,
    M extends MutationServiceUnion,
    S extends SubscriptionServiceUnion
  >(
    this: AbstractCollectionTree<Q, M, S>,
    fn: CollectionImplementationInputFn
  ): Collection<CollectionTreeImplementation> {
    return new Collection(toImplementation(this, fn));
  }
  public toDeclaration(): Collection<CollectionTreeDeclaration> {
    return new Collection(toDeclaration(this));
  }
  public toUnary<Q extends QueryServiceUnion, M extends MutationServiceUnion>(
    this: AbstractCollectionTree<Q, M, SubscriptionServiceUnion>
  ): Collection<AbstractCollectionTree<Q, M, never>> {
    return new Collection(toUnary(this));
  }
  public element(): T {
    return {
      kind: this.kind,
      exceptions: this.exceptions,
      schemas: this.schemas,
      children: this.children,
      services: this.services,
      scopes: this.scopes
    } as T;
  }
}
