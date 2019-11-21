import { ElementKind, ElementUnion, InterceptImplementation } from '~/types';

export abstract class Element<
  T extends ElementUnion | InterceptImplementation
> {
  public kind: T['kind'];
  public constructor(kind: ElementKind | 'intercept') {
    this.kind = kind;
  }
  public abstract element(): T;
}
