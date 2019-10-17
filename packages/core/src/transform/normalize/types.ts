import { Type } from '~/types';

export interface NormalizeTransformOptions {
  /**
   * Won't throw if reference types don't exist in a collection. Default: `false`.
   */
  skipReferences?: boolean | string[];
  /**
   * Given an inline type, names it and moves it to the top level of a collection when `true`. Default: `() => true`.
   */
  liftInlineType?: (type: Type) => boolean;
}
