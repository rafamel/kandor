import { CollectionTree, Element } from '~/types';
import { next } from './helpers';

export type ReplaceTransformFn = (
  element: Element,
  next: ReplaceTransformNextFn,
  data: ReplaceTransformData
) => Element;

export type ReplaceTransformNextFn = (element?: Element) => Element;

export interface ReplaceTransformData {
  path: string[];
  route: string[];
}

/**
 * Performs a traversal, returning a new collection where `Element`s are substituted by the ones returned by `cb`. Alternative to `traverse`.
 */
export function replace(
  collection: CollectionTree,
  cb: ReplaceTransformFn
): CollectionTree {
  return next(collection, { path: [], route: [] }, cb);
}
