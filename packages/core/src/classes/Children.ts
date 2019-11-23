import {
  ChildrenUnion,
  ChildrenServicesUnion,
  Optional,
  ChildrenSchemasUnion
} from '~/types';
import { Element } from './Element';

export type ChildrenConstructor = <
  A extends ChildrenServicesUnion = ChildrenServicesUnion
>(
  children: ChildrenInput<A>
) => Children<A>;

export type ChildrenInput<A extends ChildrenServicesUnion> = Optional<
  ChildrenUnion<A>,
  'kind'
>;

export class Children<
  A extends ChildrenServicesUnion = ChildrenServicesUnion
> extends Element<ChildrenUnion> {
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
