import {
  CollectionTreeImplementation,
  ServiceImplementation,
  TypeImplementation,
  TreeTypesImplementation
} from '../collection';

export type EnvelopeElement =
  | CollectionTreeImplementation
  | ServiceImplementation
  | TypeImplementation;

export interface Envelope<
  T extends EnvelopeElement = EnvelopeElement,
  N extends string = string
> {
  name: N;
  item: T;
  types?: TreeTypesImplementation;
  inline?: TreeTypesImplementation;
}

export type EnvelopeCollection<
  T extends CollectionTreeImplementation = CollectionTreeImplementation
> = Envelope<T, 'root'>;
