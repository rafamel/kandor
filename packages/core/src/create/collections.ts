import {
  CollectionTreeImplementation,
  QueryService,
  MutationService,
  SubscriptionService,
  CollectionTree
} from '~/types';
import { emptyCollection, mergeCollection } from '~/utils';

export type CollectionsCreateInput<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService
> = Partial<CollectionTree<Q, M, S>>;

export { collections };

function collections<
  Q extends QueryService = QueryService,
  M extends MutationService = MutationService,
  S extends SubscriptionService = SubscriptionService,
  C1 extends CollectionsCreateInput<Q, M, S> = CollectionTree<
    Q,
    M,
    S,
    {},
    {},
    {}
  >,
  C2 extends CollectionsCreateInput<Q, M, S> = C1,
  C3 extends CollectionsCreateInput<Q, M, S> = C1,
  C4 extends CollectionsCreateInput<Q, M, S> = C1,
  C5 extends CollectionsCreateInput<Q, M, S> = C1,
  C6 extends CollectionsCreateInput<Q, M, S> = C1,
  C7 extends CollectionsCreateInput<Q, M, S> = C1,
  C8 extends CollectionsCreateInput<Q, M, S> = C1,
  C9 extends CollectionsCreateInput<Q, M, S> = C1,
  C10 extends CollectionsCreateInput<Q, M, S> = C1,
  C11 extends CollectionsCreateInput<Q, M, S> = C1,
  C12 extends CollectionsCreateInput<Q, M, S> = C1,
  C13 extends CollectionsCreateInput<Q, M, S> = C1,
  C14 extends CollectionsCreateInput<Q, M, S> = C1,
  C15 extends CollectionsCreateInput<Q, M, S> = C1,
  C16 extends CollectionsCreateInput<Q, M, S> = C1,
  C17 extends CollectionsCreateInput<Q, M, S> = C1,
  C18 extends CollectionsCreateInput<Q, M, S> = C1,
  C19 extends CollectionsCreateInput<Q, M, S> = C1,
  C20 extends CollectionsCreateInput<Q, M, S> = C1,
  C21 extends CollectionsCreateInput<Q, M, S> = C1,
  C22 extends CollectionsCreateInput<Q, M, S> = C1,
  C23 extends CollectionsCreateInput<Q, M, S> = C1,
  C24 extends CollectionsCreateInput<Q, M, S> = C1,
  C25 extends CollectionsCreateInput<Q, M, S> = C1,
  C26 extends CollectionsCreateInput<Q, M, S> = C1,
  C27 extends CollectionsCreateInput<Q, M, S> = C1,
  C28 extends CollectionsCreateInput<Q, M, S> = C1,
  C29 extends CollectionsCreateInput<Q, M, S> = C1,
  C30 extends CollectionsCreateInput<Q, M, S> = C1,
  C31 extends CollectionsCreateInput<Q, M, S> = C1,
  C32 extends CollectionsCreateInput<Q, M, S> = C1,
  C33 extends CollectionsCreateInput<Q, M, S> = C1,
  C34 extends CollectionsCreateInput<Q, M, S> = C1,
  C35 extends CollectionsCreateInput<Q, M, S> = C1,
  C36 extends CollectionsCreateInput<Q, M, S> = C1,
  C37 extends CollectionsCreateInput<Q, M, S> = C1,
  C38 extends CollectionsCreateInput<Q, M, S> = C1,
  C39 extends CollectionsCreateInput<Q, M, S> = C1,
  C40 extends CollectionsCreateInput<Q, M, S> = C1,
  C41 extends CollectionsCreateInput<Q, M, S> = C1,
  C42 extends CollectionsCreateInput<Q, M, S> = C1,
  C43 extends CollectionsCreateInput<Q, M, S> = C1,
  C44 extends CollectionsCreateInput<Q, M, S> = C1,
  C45 extends CollectionsCreateInput<Q, M, S> = C1,
  C46 extends CollectionsCreateInput<Q, M, S> = C1,
  C47 extends CollectionsCreateInput<Q, M, S> = C1,
  C48 extends CollectionsCreateInput<Q, M, S> = C1,
  C49 extends CollectionsCreateInput<Q, M, S> = C1,
  C50 extends CollectionsCreateInput<Q, M, S> = C1
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
  c50?: C50
): CollectionTree<Q, M, S, {}, {}, {}> &
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
  C50;

/**
 * Merges collections.
 */
function collections(
  ...collections: CollectionsCreateInput[]
): CollectionTreeImplementation {
  let collection = emptyCollection() as CollectionTreeImplementation;

  for (const item of collections) {
    collection = mergeCollection(collection, { ...collection, ...item });
  }

  return collection;
}
