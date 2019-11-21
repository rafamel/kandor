import {
  AbstractCollectionTree,
  CollectionTreeUnion,
  QueryServiceUnion,
  MutationServiceUnion,
  SubscriptionServiceUnion
} from '~/types';
import { emptyCollection, mergeCollection } from '~/helpers';

export { collections };

function collections<
  Q extends QueryServiceUnion,
  M extends MutationServiceUnion,
  S extends SubscriptionServiceUnion,
  C1 extends AbstractCollectionTree<Q, M, S>,
  C2 extends AbstractCollectionTree<Q, M, S> = C1,
  C3 extends AbstractCollectionTree<Q, M, S> = C1,
  C4 extends AbstractCollectionTree<Q, M, S> = C1,
  C5 extends AbstractCollectionTree<Q, M, S> = C1,
  C6 extends AbstractCollectionTree<Q, M, S> = C1,
  C7 extends AbstractCollectionTree<Q, M, S> = C1,
  C8 extends AbstractCollectionTree<Q, M, S> = C1,
  C9 extends AbstractCollectionTree<Q, M, S> = C1,
  C10 extends AbstractCollectionTree<Q, M, S> = C1,
  C11 extends AbstractCollectionTree<Q, M, S> = C1,
  C12 extends AbstractCollectionTree<Q, M, S> = C1,
  C13 extends AbstractCollectionTree<Q, M, S> = C1,
  C14 extends AbstractCollectionTree<Q, M, S> = C1,
  C15 extends AbstractCollectionTree<Q, M, S> = C1,
  C16 extends AbstractCollectionTree<Q, M, S> = C1,
  C17 extends AbstractCollectionTree<Q, M, S> = C1,
  C18 extends AbstractCollectionTree<Q, M, S> = C1,
  C19 extends AbstractCollectionTree<Q, M, S> = C1,
  C20 extends AbstractCollectionTree<Q, M, S> = C1,
  C21 extends AbstractCollectionTree<Q, M, S> = C1,
  C22 extends AbstractCollectionTree<Q, M, S> = C1,
  C23 extends AbstractCollectionTree<Q, M, S> = C1,
  C24 extends AbstractCollectionTree<Q, M, S> = C1,
  C25 extends AbstractCollectionTree<Q, M, S> = C1,
  C26 extends AbstractCollectionTree<Q, M, S> = C1,
  C27 extends AbstractCollectionTree<Q, M, S> = C1,
  C28 extends AbstractCollectionTree<Q, M, S> = C1,
  C29 extends AbstractCollectionTree<Q, M, S> = C1,
  C30 extends AbstractCollectionTree<Q, M, S> = C1,
  C31 extends AbstractCollectionTree<Q, M, S> = C1,
  C32 extends AbstractCollectionTree<Q, M, S> = C1,
  C33 extends AbstractCollectionTree<Q, M, S> = C1,
  C34 extends AbstractCollectionTree<Q, M, S> = C1,
  C35 extends AbstractCollectionTree<Q, M, S> = C1,
  C36 extends AbstractCollectionTree<Q, M, S> = C1,
  C37 extends AbstractCollectionTree<Q, M, S> = C1,
  C38 extends AbstractCollectionTree<Q, M, S> = C1,
  C39 extends AbstractCollectionTree<Q, M, S> = C1,
  C40 extends AbstractCollectionTree<Q, M, S> = C1,
  C41 extends AbstractCollectionTree<Q, M, S> = C1,
  C42 extends AbstractCollectionTree<Q, M, S> = C1,
  C43 extends AbstractCollectionTree<Q, M, S> = C1,
  C44 extends AbstractCollectionTree<Q, M, S> = C1,
  C45 extends AbstractCollectionTree<Q, M, S> = C1,
  C46 extends AbstractCollectionTree<Q, M, S> = C1,
  C47 extends AbstractCollectionTree<Q, M, S> = C1,
  C48 extends AbstractCollectionTree<Q, M, S> = C1,
  C49 extends AbstractCollectionTree<Q, M, S> = C1,
  C50 extends AbstractCollectionTree<Q, M, S> = C1
>(
  c1?: C1 & AbstractCollectionTree<Q, M, S>,
  c2?: C2 & AbstractCollectionTree<Q, M, S>,
  c3?: C3 & AbstractCollectionTree<Q, M, S>,
  c4?: C4 & AbstractCollectionTree<Q, M, S>,
  c5?: C5 & AbstractCollectionTree<Q, M, S>,
  c6?: C6 & AbstractCollectionTree<Q, M, S>,
  c7?: C7 & AbstractCollectionTree<Q, M, S>,
  c8?: C8 & AbstractCollectionTree<Q, M, S>,
  c9?: C9 & AbstractCollectionTree<Q, M, S>,
  c10?: C10 & AbstractCollectionTree<Q, M, S>,
  c11?: C11 & AbstractCollectionTree<Q, M, S>,
  c12?: C12 & AbstractCollectionTree<Q, M, S>,
  c13?: C13 & AbstractCollectionTree<Q, M, S>,
  c14?: C14 & AbstractCollectionTree<Q, M, S>,
  c15?: C15 & AbstractCollectionTree<Q, M, S>,
  c16?: C16 & AbstractCollectionTree<Q, M, S>,
  c17?: C17 & AbstractCollectionTree<Q, M, S>,
  c18?: C18 & AbstractCollectionTree<Q, M, S>,
  c19?: C19 & AbstractCollectionTree<Q, M, S>,
  c20?: C20 & AbstractCollectionTree<Q, M, S>,
  c21?: C21 & AbstractCollectionTree<Q, M, S>,
  c22?: C22 & AbstractCollectionTree<Q, M, S>,
  c23?: C23 & AbstractCollectionTree<Q, M, S>,
  c24?: C24 & AbstractCollectionTree<Q, M, S>,
  c25?: C25 & AbstractCollectionTree<Q, M, S>,
  c26?: C26 & AbstractCollectionTree<Q, M, S>,
  c27?: C27 & AbstractCollectionTree<Q, M, S>,
  c28?: C28 & AbstractCollectionTree<Q, M, S>,
  c29?: C29 & AbstractCollectionTree<Q, M, S>,
  c30?: C30 & AbstractCollectionTree<Q, M, S>,
  c31?: C31 & AbstractCollectionTree<Q, M, S>,
  c32?: C32 & AbstractCollectionTree<Q, M, S>,
  c33?: C33 & AbstractCollectionTree<Q, M, S>,
  c34?: C34 & AbstractCollectionTree<Q, M, S>,
  c35?: C35 & AbstractCollectionTree<Q, M, S>,
  c36?: C36 & AbstractCollectionTree<Q, M, S>,
  c37?: C37 & AbstractCollectionTree<Q, M, S>,
  c38?: C38 & AbstractCollectionTree<Q, M, S>,
  c39?: C39 & AbstractCollectionTree<Q, M, S>,
  c40?: C40 & AbstractCollectionTree<Q, M, S>,
  c41?: C41 & AbstractCollectionTree<Q, M, S>,
  c42?: C42 & AbstractCollectionTree<Q, M, S>,
  c43?: C43 & AbstractCollectionTree<Q, M, S>,
  c44?: C44 & AbstractCollectionTree<Q, M, S>,
  c45?: C45 & AbstractCollectionTree<Q, M, S>,
  c46?: C46 & AbstractCollectionTree<Q, M, S>,
  c47?: C47 & AbstractCollectionTree<Q, M, S>,
  c48?: C48 & AbstractCollectionTree<Q, M, S>,
  c49?: C49 & AbstractCollectionTree<Q, M, S>,
  c50?: C50 & AbstractCollectionTree<Q, M, S>
): AbstractCollectionTree<Q, M, S, {}, {}, {}> &
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
  ...collections: CollectionTreeUnion[]
): CollectionTreeUnion {
  let collection = emptyCollection();

  for (const item of collections) {
    collection = mergeCollection(collection, {
      ...collection,
      ...item
    });
  }

  return collection;
}
