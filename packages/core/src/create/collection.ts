import {
  FreeItem,
  FreeKind,
  PartialPopulatedTree,
  CollectionTree,
  FreeCollection,
  ServiceImplementation,
  Type,
  FreeItemTypes
} from '~/types';
import {
  emptyCollection,
  mergeCollection,
  emptyTypes,
  mergeTypes
} from '~/utils';

export default function collection<
  K1 extends FreeKind,
  N1 extends string,
  K2 extends FreeKind,
  N2 extends string,
  K3 extends FreeKind,
  N3 extends string,
  K4 extends FreeKind,
  N4 extends string,
  K5 extends FreeKind,
  N5 extends string,
  K6 extends FreeKind,
  N6 extends string,
  K7 extends FreeKind,
  N7 extends string,
  K8 extends FreeKind,
  N8 extends string,
  K9 extends FreeKind,
  N9 extends string,
  K10 extends FreeKind,
  N10 extends string,
  K11 extends FreeKind,
  N11 extends string,
  K12 extends FreeKind,
  N12 extends string,
  K13 extends FreeKind,
  N13 extends string,
  K14 extends FreeKind,
  N14 extends string,
  K15 extends FreeKind,
  N15 extends string,
  K16 extends FreeKind,
  N16 extends string,
  K17 extends FreeKind,
  N17 extends string,
  K18 extends FreeKind,
  N18 extends string,
  K19 extends FreeKind,
  N19 extends string,
  K20 extends FreeKind,
  N20 extends string,
  K21 extends FreeKind,
  N21 extends string,
  K22 extends FreeKind,
  N22 extends string,
  K23 extends FreeKind,
  N23 extends string,
  K24 extends FreeKind,
  N24 extends string,
  K25 extends FreeKind,
  N25 extends string,
  K26 extends FreeKind,
  N26 extends string,
  K27 extends FreeKind,
  N27 extends string,
  K28 extends FreeKind,
  N28 extends string,
  K29 extends FreeKind,
  N29 extends string,
  K30 extends FreeKind,
  N30 extends string,
  K31 extends FreeKind,
  N31 extends string,
  K32 extends FreeKind,
  N32 extends string,
  K33 extends FreeKind,
  N33 extends string,
  K34 extends FreeKind,
  N34 extends string,
  K35 extends FreeKind,
  N35 extends string,
  K36 extends FreeKind,
  N36 extends string,
  K37 extends FreeKind,
  N37 extends string,
  K38 extends FreeKind,
  N38 extends string,
  K39 extends FreeKind,
  N39 extends string,
  K40 extends FreeKind,
  N40 extends string,
  K41 extends FreeKind,
  N41 extends string,
  K42 extends FreeKind,
  N42 extends string,
  K43 extends FreeKind,
  N43 extends string,
  K44 extends FreeKind,
  N44 extends string,
  K45 extends FreeKind,
  N45 extends string,
  K46 extends FreeKind,
  N46 extends string,
  K47 extends FreeKind,
  N47 extends string,
  K48 extends FreeKind,
  N48 extends string,
  K49 extends FreeKind,
  N49 extends string,
  K50 extends FreeKind,
  N50 extends string
>(
  f1: FreeItem<K1, N1>,
  f2?: FreeItem<K2, N2>,
  f3?: FreeItem<K3, N3>,
  f4?: FreeItem<K4, N4>,
  f5?: FreeItem<K5, N5>,
  f6?: FreeItem<K6, N6>,
  f7?: FreeItem<K7, N7>,
  f8?: FreeItem<K8, N8>,
  f9?: FreeItem<K9, N9>,
  f10?: FreeItem<K10, N10>,
  f11?: FreeItem<K11, N11>,
  f12?: FreeItem<K12, N12>,
  f13?: FreeItem<K13, N13>,
  f14?: FreeItem<K14, N14>,
  f15?: FreeItem<K15, N15>,
  f16?: FreeItem<K16, N16>,
  f17?: FreeItem<K17, N17>,
  f18?: FreeItem<K18, N18>,
  f19?: FreeItem<K19, N19>,
  f20?: FreeItem<K20, N20>,
  f21?: FreeItem<K21, N21>,
  f22?: FreeItem<K22, N22>,
  f23?: FreeItem<K23, N23>,
  f24?: FreeItem<K24, N24>,
  f25?: FreeItem<K25, N25>,
  f26?: FreeItem<K26, N26>,
  f27?: FreeItem<K27, N27>,
  f28?: FreeItem<K28, N28>,
  f29?: FreeItem<K29, N29>,
  f30?: FreeItem<K30, N30>,
  f31?: FreeItem<K31, N31>,
  f32?: FreeItem<K32, N32>,
  f33?: FreeItem<K33, N33>,
  f34?: FreeItem<K34, N34>,
  f35?: FreeItem<K35, N35>,
  f36?: FreeItem<K36, N36>,
  f37?: FreeItem<K37, N37>,
  f38?: FreeItem<K38, N38>,
  f39?: FreeItem<K39, N39>,
  f40?: FreeItem<K40, N40>,
  f41?: FreeItem<K41, N41>,
  f42?: FreeItem<K42, N42>,
  f43?: FreeItem<K43, N43>,
  f44?: FreeItem<K44, N44>,
  f45?: FreeItem<K45, N45>,
  f46?: FreeItem<K46, N46>,
  f47?: FreeItem<K47, N47>,
  f48?: FreeItem<K48, N48>,
  f49?: FreeItem<K49, N49>,
  f50?: FreeItem<K50, N50>
): FreeCollection<
  CollectionTree &
    PartialPopulatedTree<K1, N1> &
    PartialPopulatedTree<K2, N2> &
    PartialPopulatedTree<K3, N3> &
    PartialPopulatedTree<K4, N4> &
    PartialPopulatedTree<K5, N5> &
    PartialPopulatedTree<K6, N6> &
    PartialPopulatedTree<K7, N7> &
    PartialPopulatedTree<K8, N8> &
    PartialPopulatedTree<K9, N9> &
    PartialPopulatedTree<K10, N10> &
    PartialPopulatedTree<K11, N11> &
    PartialPopulatedTree<K12, N12> &
    PartialPopulatedTree<K13, N13> &
    PartialPopulatedTree<K14, N14> &
    PartialPopulatedTree<K15, N15> &
    PartialPopulatedTree<K16, N16> &
    PartialPopulatedTree<K17, N17> &
    PartialPopulatedTree<K18, N18> &
    PartialPopulatedTree<K19, N19> &
    PartialPopulatedTree<K20, N20> &
    PartialPopulatedTree<K21, N21> &
    PartialPopulatedTree<K22, N22> &
    PartialPopulatedTree<K23, N23> &
    PartialPopulatedTree<K24, N24> &
    PartialPopulatedTree<K25, N25> &
    PartialPopulatedTree<K26, N26> &
    PartialPopulatedTree<K27, N27> &
    PartialPopulatedTree<K28, N28> &
    PartialPopulatedTree<K29, N29> &
    PartialPopulatedTree<K30, N30> &
    PartialPopulatedTree<K31, N31> &
    PartialPopulatedTree<K32, N32> &
    PartialPopulatedTree<K33, N33> &
    PartialPopulatedTree<K34, N34> &
    PartialPopulatedTree<K35, N35> &
    PartialPopulatedTree<K36, N36> &
    PartialPopulatedTree<K37, N37> &
    PartialPopulatedTree<K38, N38> &
    PartialPopulatedTree<K39, N39> &
    PartialPopulatedTree<K40, N40> &
    PartialPopulatedTree<K41, N41> &
    PartialPopulatedTree<K42, N42> &
    PartialPopulatedTree<K43, N43> &
    PartialPopulatedTree<K44, N44> &
    PartialPopulatedTree<K45, N45> &
    PartialPopulatedTree<K46, N46> &
    PartialPopulatedTree<K47, N47> &
    PartialPopulatedTree<K48, N48> &
    PartialPopulatedTree<K49, N49> &
    PartialPopulatedTree<K50, N50>
>;

// Implementation
export default function collection(
  ...items: Array<FreeItem | undefined>
): FreeCollection<CollectionTree> {
  let collection = emptyCollection();
  let types: FreeItemTypes = { ...emptyTypes(), inline: emptyTypes() };

  for (const item of items) {
    if (!item) continue;

    if (item.types) {
      types = {
        ...mergeTypes(types, item.types),
        inline: mergeTypes(
          types.inline || emptyTypes(),
          item.types.inline || emptyTypes()
        )
      };
    }
    switch (item.kind) {
      case 'collection':
        collection = mergeCollection(collection, item.item as CollectionTree);
        break;
      case 'query':
      case 'mutation':
      case 'subscription':
        collection.services[item.kind][
          item.name as string
        ] = item.item as ServiceImplementation;
        break;
      case 'error':
      case 'request':
      case 'response':
        collection.types[item.kind][item.name as string] = item.item as Type;
        break;
      default:
        throw Error(`Kind ${item.kind} is not valid`);
    }
  }

  return {
    name: null,
    kind: 'collection',
    item: collection,
    types
  };
}
