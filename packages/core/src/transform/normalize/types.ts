export interface NormalizeTransformOptions {
  /**
   * Won't throw if reference types don't exist in a collection. Default: `false`.
   */
  skipReferences?: boolean | string[];
}
