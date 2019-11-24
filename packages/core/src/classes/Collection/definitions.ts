import {
  CollectionTreeUnion,
  ScopeTreeUnion,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion,
  AbstractElement,
  ElementInfo,
  CollectionTreeImplementation,
  CollectionTreeDeclaration,
  ExceptionsRecordUnion,
  SchemasRecordUnion,
  ChildrenRecordUnion,
  ServicesRecordUnion,
  ScopesRecordUnion,
  ServiceImplementation,
  ExceptionsRecordImplementation,
  SchemasRecordImplementation,
  ExceptionsRecordDeclaration,
  SchemasRecordDeclaration,
  CollectionTreeKind
} from '~/types';
import { Collection } from './Collection';

/* Main */
export type CollectionConstructor = <
  A extends ExceptionsRecordUnion = {},
  B extends SchemasRecordUnion = {},
  C extends ChildrenRecordUnion = {},
  D extends ServicesRecordUnion = {},
  E extends ScopesRecordUnion = {}
>(
  collection: CollectionInput<A, B, C, D, E>
) => Collection<A, B, C, D, E>;

export interface CollectionInput<
  A extends ExceptionsRecordUnion = {},
  B extends SchemasRecordUnion = {},
  C extends ChildrenRecordUnion = {},
  D extends ServicesRecordUnion = {},
  E extends ScopesRecordUnion = {}
> {
  kind?: CollectionTreeKind;
  exceptions?: A;
  schemas?: B;
  children?: C;
  services?: D;
  scopes?: E;
}

export type CollectionInstance<T extends CollectionTreeUnion> = Collection<
  T['exceptions'],
  T['schemas'],
  T['children'],
  T['services'],
  T['scopes']
>;

/* Input */
export type CollectionFilterInputFn<
  Q extends QueryServiceUnion = QueryServiceUnion,
  M extends MutationServiceUnion = MutationServiceUnion,
  S extends SubscriptionServiceUnion = SubscriptionServiceUnion
> = (element: AbstractElement<Q, M, S>, info: ElementInfo) => boolean;

export type CollectionImplementationInputFn<
  Q extends QueryServiceUnion = QueryServiceUnion,
  M extends MutationServiceUnion = MutationServiceUnion,
  S extends SubscriptionServiceUnion = SubscriptionServiceUnion
> = (service: Q | M | S, info: Required<ElementInfo>) => ServiceImplementation;

/* Options */
export interface CollectionInterceptOptions {
  /**
   * Whether intercepts should be prepended or apended to the existing ones.
   * Default: `true`.
   */
  prepend?: boolean;
}

export interface CollectionValidateOptions {
  /**
   * If specified, it will throw if a collection is
   * neither fully a implementation or a declaration.
   * Default: `null`.
   */
  as?: 'implementation' | 'declaration' | null;
  /**
   * Doesn't check reference types do exist in a collection.
   * Default: `false`.
   */
  skipReferences?: boolean | string[];
}

export interface CollectionLiftOptions {
  /**
   * Won't throw if a schema or exception as a reference doesn't exist in a collection. Default: `false`.
   */
  skipReferences?: boolean | string[];
}

/* Maps */
export type RankCollection<
  T extends CollectionTreeUnion
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation
  : T extends CollectionTreeDeclaration
  ? CollectionTreeDeclaration
  : CollectionTreeUnion;

export type ScopeCollection<
  A extends ExceptionsRecordUnion,
  B extends SchemasRecordUnion,
  C extends ChildrenRecordUnion,
  D extends ServicesRecordUnion,
  E extends ScopesRecordUnion,
  N extends string
> = CollectionTreeUnion<A, B, C, {}, { [P in N]: ScopeTreeUnion<D, E> }>;

export type ExtractScope<
  A extends ExceptionsRecordUnion,
  B extends SchemasRecordUnion,
  C extends ChildrenRecordUnion,
  E extends ScopesRecordUnion,
  N extends keyof E
> = CollectionTreeUnion<A, B, C, E[N]['services'], E[N]['scopes']>;

export type LiftCollection<
  T extends CollectionTreeUnion
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation<
      ExceptionsRecordImplementation,
      SchemasRecordImplementation,
      T['children'],
      T['services'],
      T['scopes']
    >
  : T extends CollectionTreeDeclaration
  ? CollectionTreeDeclaration<
      ExceptionsRecordDeclaration,
      SchemasRecordDeclaration,
      T['children'],
      T['services'],
      T['scopes']
    >
  : CollectionTreeUnion<
      ExceptionsRecordUnion,
      SchemasRecordUnion,
      T['children'],
      T['services'],
      T['scopes']
    >;

/* Functions */
export type CollectionMergeFn = <
  C1 extends CollectionTreeUnion = CollectionTreeUnion,
  C2 extends CollectionTreeUnion = C1,
  C3 extends CollectionTreeUnion = C1,
  C4 extends CollectionTreeUnion = C1,
  C5 extends CollectionTreeUnion = C1,
  C6 extends CollectionTreeUnion = C1,
  C7 extends CollectionTreeUnion = C1,
  C8 extends CollectionTreeUnion = C1,
  C9 extends CollectionTreeUnion = C1,
  C10 extends CollectionTreeUnion = C1,
  C11 extends CollectionTreeUnion = C1,
  C12 extends CollectionTreeUnion = C1,
  C13 extends CollectionTreeUnion = C1,
  C14 extends CollectionTreeUnion = C1,
  C15 extends CollectionTreeUnion = C1,
  C16 extends CollectionTreeUnion = C1,
  C17 extends CollectionTreeUnion = C1,
  C18 extends CollectionTreeUnion = C1,
  C19 extends CollectionTreeUnion = C1,
  C20 extends CollectionTreeUnion = C1,
  C21 extends CollectionTreeUnion = C1,
  C22 extends CollectionTreeUnion = C1,
  C23 extends CollectionTreeUnion = C1,
  C24 extends CollectionTreeUnion = C1,
  C25 extends CollectionTreeUnion = C1,
  C26 extends CollectionTreeUnion = C1,
  C27 extends CollectionTreeUnion = C1,
  C28 extends CollectionTreeUnion = C1,
  C29 extends CollectionTreeUnion = C1,
  C30 extends CollectionTreeUnion = C1,
  C31 extends CollectionTreeUnion = C1,
  C32 extends CollectionTreeUnion = C1,
  C33 extends CollectionTreeUnion = C1,
  C34 extends CollectionTreeUnion = C1,
  C35 extends CollectionTreeUnion = C1,
  C36 extends CollectionTreeUnion = C1,
  C37 extends CollectionTreeUnion = C1,
  C38 extends CollectionTreeUnion = C1,
  C39 extends CollectionTreeUnion = C1,
  C40 extends CollectionTreeUnion = C1,
  C41 extends CollectionTreeUnion = C1,
  C42 extends CollectionTreeUnion = C1,
  C43 extends CollectionTreeUnion = C1,
  C44 extends CollectionTreeUnion = C1,
  C45 extends CollectionTreeUnion = C1,
  C46 extends CollectionTreeUnion = C1,
  C47 extends CollectionTreeUnion = C1,
  C48 extends CollectionTreeUnion = C1,
  C49 extends CollectionTreeUnion = C1,
  C50 extends CollectionTreeUnion = C1
>(
  c1?: C1,
  c2?: C2,
  c3?: C3,
  c4?: C4,
  c5?: C5,
  c6?: C6,
  c7?: C7,
  c8?: C8,
  c9?: C9,
  c10?: C10,
  c11?: C11,
  c12?: C12,
  c13?: C13,
  c14?: C14,
  c15?: C15,
  c16?: C16,
  c17?: C17,
  c18?: C18,
  c19?: C19,
  c20?: C20,
  c21?: C21,
  c22?: C22,
  c23?: C23,
  c24?: C24,
  c25?: C25,
  c26?: C26,
  c27?: C27,
  c28?: C28,
  c29?: C29,
  c30?: C30,
  c31?: C31,
  c32?: C32,
  c33?: C33,
  c34?: C34,
  c35?: C35,
  c36?: C36,
  c37?: C37,
  c38?: C38,
  c39?: C39,
  c40?: C40,
  c41?: C41,
  c42?: C42,
  c43?: C43,
  c44?: C44,
  c45?: C45,
  c46?: C46,
  c47?: C47,
  c48?: C48,
  c49?: C49,
  c50?: C50 & CollectionTreeUnion
) => CollectionInstance<
  C1 &
    C2 &
    C3 &
    C4 &
    C5 &
    C6 &
    C7 &
    C8 &
    C9 &
    C10 &
    C11 &
    C12 &
    C13 &
    C14 &
    C15 &
    C16 &
    C17 &
    C18 &
    C19 &
    C20 &
    C21 &
    C22 &
    C23 &
    C24 &
    C25 &
    C26 &
    C27 &
    C28 &
    C29 &
    C30 &
    C31 &
    C32 &
    C33 &
    C34 &
    C35 &
    C36 &
    C37 &
    C38 &
    C39 &
    C40 &
    C41 &
    C42 &
    C43 &
    C44 &
    C45 &
    C46 &
    C47 &
    C48 &
    C49 &
    C50
>;
