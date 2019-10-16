import {
  CollectionTreeImplementation,
  CollectionTree,
  ErrorType,
  ServiceImplementation,
  Service
} from './collection';
import { GenericError } from './types';

export type ApplicationCollection<T extends CollectionTree> = T & {
  types: { [P in GenericError]: ErrorType };
};

export type NormalCollection<
  T extends CollectionTree
> = T extends CollectionTreeImplementation
  ? CollectionTreeImplementation
  : CollectionTree;

export interface CollectionRoutes<T extends CollectionTree> {
  [key: string]: T extends CollectionTreeImplementation
    ? ServiceImplementation
    : Service;
}
