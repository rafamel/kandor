import {
  Envelope,
  CollectionPopulate,
  EnvelopeElement,
  CollectionTreeImplementation,
  EnvelopeCollection
} from '~/types';
import {
  mergeTypes,
  emptyCollection,
  mergeCollection,
  mergeServices,
  mergeEnvelopeTypes
} from '~/utils';

export default collection;

function collection<
  K1 extends EnvelopeElement,
  N1 extends string,
  K2 extends EnvelopeElement,
  N2 extends string,
  K3 extends EnvelopeElement,
  N3 extends string,
  K4 extends EnvelopeElement,
  N4 extends string,
  K5 extends EnvelopeElement,
  N5 extends string,
  K6 extends EnvelopeElement,
  N6 extends string,
  K7 extends EnvelopeElement,
  N7 extends string,
  K8 extends EnvelopeElement,
  N8 extends string,
  K9 extends EnvelopeElement,
  N9 extends string,
  K10 extends EnvelopeElement,
  N10 extends string,
  K11 extends EnvelopeElement,
  N11 extends string,
  K12 extends EnvelopeElement,
  N12 extends string,
  K13 extends EnvelopeElement,
  N13 extends string,
  K14 extends EnvelopeElement,
  N14 extends string,
  K15 extends EnvelopeElement,
  N15 extends string,
  K16 extends EnvelopeElement,
  N16 extends string,
  K17 extends EnvelopeElement,
  N17 extends string,
  K18 extends EnvelopeElement,
  N18 extends string,
  K19 extends EnvelopeElement,
  N19 extends string,
  K20 extends EnvelopeElement,
  N20 extends string,
  K21 extends EnvelopeElement,
  N21 extends string,
  K22 extends EnvelopeElement,
  N22 extends string,
  K23 extends EnvelopeElement,
  N23 extends string,
  K24 extends EnvelopeElement,
  N24 extends string,
  K25 extends EnvelopeElement,
  N25 extends string,
  K26 extends EnvelopeElement,
  N26 extends string,
  K27 extends EnvelopeElement,
  N27 extends string,
  K28 extends EnvelopeElement,
  N28 extends string,
  K29 extends EnvelopeElement,
  N29 extends string,
  K30 extends EnvelopeElement,
  N30 extends string,
  K31 extends EnvelopeElement,
  N31 extends string,
  K32 extends EnvelopeElement,
  N32 extends string,
  K33 extends EnvelopeElement,
  N33 extends string,
  K34 extends EnvelopeElement,
  N34 extends string,
  K35 extends EnvelopeElement,
  N35 extends string,
  K36 extends EnvelopeElement,
  N36 extends string,
  K37 extends EnvelopeElement,
  N37 extends string,
  K38 extends EnvelopeElement,
  N38 extends string,
  K39 extends EnvelopeElement,
  N39 extends string,
  K40 extends EnvelopeElement,
  N40 extends string,
  K41 extends EnvelopeElement,
  N41 extends string,
  K42 extends EnvelopeElement,
  N42 extends string,
  K43 extends EnvelopeElement,
  N43 extends string,
  K44 extends EnvelopeElement,
  N44 extends string,
  K45 extends EnvelopeElement,
  N45 extends string,
  K46 extends EnvelopeElement,
  N46 extends string,
  K47 extends EnvelopeElement,
  N47 extends string,
  K48 extends EnvelopeElement,
  N48 extends string,
  K49 extends EnvelopeElement,
  N49 extends string,
  K50 extends EnvelopeElement,
  N50 extends string
>(
  f1: Envelope<K1, N1>,
  f2?: Envelope<K2, N2>,
  f3?: Envelope<K3, N3>,
  f4?: Envelope<K4, N4>,
  f5?: Envelope<K5, N5>,
  f6?: Envelope<K6, N6>,
  f7?: Envelope<K7, N7>,
  f8?: Envelope<K8, N8>,
  f9?: Envelope<K9, N9>,
  f10?: Envelope<K10, N10>,
  f11?: Envelope<K11, N11>,
  f12?: Envelope<K12, N12>,
  f13?: Envelope<K13, N13>,
  f14?: Envelope<K14, N14>,
  f15?: Envelope<K15, N15>,
  f16?: Envelope<K16, N16>,
  f17?: Envelope<K17, N17>,
  f18?: Envelope<K18, N18>,
  f19?: Envelope<K19, N19>,
  f20?: Envelope<K20, N20>,
  f21?: Envelope<K21, N21>,
  f22?: Envelope<K22, N22>,
  f23?: Envelope<K23, N23>,
  f24?: Envelope<K24, N24>,
  f25?: Envelope<K25, N25>,
  f26?: Envelope<K26, N26>,
  f27?: Envelope<K27, N27>,
  f28?: Envelope<K28, N28>,
  f29?: Envelope<K29, N29>,
  f30?: Envelope<K30, N30>,
  f31?: Envelope<K31, N31>,
  f32?: Envelope<K32, N32>,
  f33?: Envelope<K33, N33>,
  f34?: Envelope<K34, N34>,
  f35?: Envelope<K35, N35>,
  f36?: Envelope<K36, N36>,
  f37?: Envelope<K37, N37>,
  f38?: Envelope<K38, N38>,
  f39?: Envelope<K39, N39>,
  f40?: Envelope<K40, N40>,
  f41?: Envelope<K41, N41>,
  f42?: Envelope<K42, N42>,
  f43?: Envelope<K43, N43>,
  f44?: Envelope<K44, N44>,
  f45?: Envelope<K45, N45>,
  f46?: Envelope<K46, N46>,
  f47?: Envelope<K47, N47>,
  f48?: Envelope<K48, N48>,
  f49?: Envelope<K49, N49>,
  f50?: Envelope<K50, N50>
): EnvelopeCollection<
  CollectionTreeImplementation &
    CollectionPopulate<K1, N1> &
    CollectionPopulate<K2, N2> &
    CollectionPopulate<K3, N3> &
    CollectionPopulate<K4, N4> &
    CollectionPopulate<K5, N5> &
    CollectionPopulate<K6, N6> &
    CollectionPopulate<K7, N7> &
    CollectionPopulate<K8, N8> &
    CollectionPopulate<K9, N9> &
    CollectionPopulate<K10, N10> &
    CollectionPopulate<K11, N11> &
    CollectionPopulate<K12, N12> &
    CollectionPopulate<K13, N13> &
    CollectionPopulate<K14, N14> &
    CollectionPopulate<K15, N15> &
    CollectionPopulate<K16, N16> &
    CollectionPopulate<K17, N17> &
    CollectionPopulate<K18, N18> &
    CollectionPopulate<K19, N19> &
    CollectionPopulate<K20, N20> &
    CollectionPopulate<K21, N21> &
    CollectionPopulate<K22, N22> &
    CollectionPopulate<K23, N23> &
    CollectionPopulate<K24, N24> &
    CollectionPopulate<K25, N25> &
    CollectionPopulate<K26, N26> &
    CollectionPopulate<K27, N27> &
    CollectionPopulate<K28, N28> &
    CollectionPopulate<K29, N29> &
    CollectionPopulate<K30, N30> &
    CollectionPopulate<K31, N31> &
    CollectionPopulate<K32, N32> &
    CollectionPopulate<K33, N33> &
    CollectionPopulate<K34, N34> &
    CollectionPopulate<K35, N35> &
    CollectionPopulate<K36, N36> &
    CollectionPopulate<K37, N37> &
    CollectionPopulate<K38, N38> &
    CollectionPopulate<K39, N39> &
    CollectionPopulate<K40, N40> &
    CollectionPopulate<K41, N41> &
    CollectionPopulate<K42, N42> &
    CollectionPopulate<K43, N43> &
    CollectionPopulate<K44, N44> &
    CollectionPopulate<K45, N45> &
    CollectionPopulate<K46, N46> &
    CollectionPopulate<K47, N47> &
    CollectionPopulate<K48, N48> &
    CollectionPopulate<K49, N49> &
    CollectionPopulate<K50, N50>
>;

// Implementation
function collection(
  ...items: Array<Envelope<EnvelopeElement> | undefined>
): EnvelopeCollection {
  let envelope: EnvelopeCollection = {
    name: 'root',
    item: emptyCollection() as CollectionTreeImplementation
  };

  for (const item of items) {
    if (!item) continue;

    envelope = mergeEnvelopeTypes(envelope, item);
    switch (item.item.kind) {
      case 'collection': {
        envelope.item = mergeCollection(envelope.item, item.item);
        break;
      }
      case 'query':
      case 'mutation':
      case 'subscription': {
        envelope.item.services = mergeServices(envelope.item.services, {
          [item.name]: item.item
        });
        break;
      }
      case 'error':
      case 'request':
      case 'response': {
        envelope.item.types = mergeTypes(envelope.item.types, {
          [item.name]: item.item
        });
        break;
      }
      default: {
        throw Error(`Kind is not valid`);
      }
    }
  }

  return envelope;
}
