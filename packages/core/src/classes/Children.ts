import { ChildrenUnion, ChildrenServicesUnion } from '~/types';
import { Element } from './Element';

export type ChildrenCreateInput<A extends ChildrenServicesUnion> = Omit<
  ChildrenUnion<A>,
  'kind'
>;

export class Children<T extends ChildrenUnion = ChildrenUnion> extends Element<
  T
> {
  public static create<A extends ChildrenServicesUnion>(
    children: ChildrenCreateInput<A>
  ): Children<ChildrenUnion<A>> {
    return new Children({
      kind: 'children',
      ...children
    });
  }
  public readonly schemas: T['schemas'];
  public readonly services: T['services'];
  public constructor(exception: T) {
    super(exception.kind);
    this.schemas = exception.schemas;
    this.services = exception.services;
  }
  public element(): T {
    return {
      kind: this.kind,
      schemas: this.schemas,
      services: this.services
    } as T;
  }
}
