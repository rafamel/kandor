import { JSONSchema4 } from 'json-schema';
import {
  CollectionTree,
  CollectionTreeImplementation,
  ServiceImplementation,
  Service
} from './collection';

export type Schema = JSONSchema4;

export type ErrorCode = ClientErrorCode | ServerErrorCode;

export type ClientErrorCode =
  | 'ClientError'
  | 'ClientUnauthorized'
  | 'ClientForbidden'
  | 'ClientNotFound'
  | 'ClientConflict'
  | 'ClientUnsupported'
  | 'ClientTooEarly'
  | 'ClientRateLimit';

export type ServerErrorCode =
  | 'ServerError'
  | 'ServerNotImplemented'
  | 'ServerUnavailable'
  | 'ServerTimeout';

export type GenericError = 'ClientError' | 'ServerError';

export interface Routes<T extends CollectionTree> {
  [key: string]: T extends CollectionTreeImplementation
    ? ServiceImplementation
    : Service;
}
