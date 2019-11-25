import {
  ChildrenUnion,
  ChildrenServicesUnion,
  Optional,
  ChildrenSchemasUnion
} from '~/types';
import { Element } from './Element';

export type ChildrenInput<A extends ChildrenServicesUnion> = Optional<
  ChildrenUnion<A>,
  'kind'
>;

export class Children<
  A extends ChildrenServicesUnion = ChildrenServicesUnion
> extends Element<ChildrenUnion> {
  public static ensure<A extends ChildrenServicesUnion = ChildrenServicesUnion>(
    children: ChildrenUnion<A>
  ): Children<A> {
    return children instanceof Children ? children : new Children(children);
  }
  public readonly schemas: ChildrenSchemasUnion;
  public readonly services: A;
  public constructor(children: ChildrenInput<A>) {
    super('children');
    this.schemas = children.schemas;
    this.services = children.services;
  }
  public element(): ChildrenUnion<A> {
    return {
      kind: this.kind,
      schemas: this.schemas,
      services: this.services
    };
  }
}
