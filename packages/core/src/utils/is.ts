import {
  Tree,
  CollectionTree,
  Element,
  Service,
  Type,
  ServiceImplementation,
  QueryService,
  MutationService,
  SubscriptionService,
  ErrorType,
  RequestType,
  ResponseType,
  TypeImplementation
} from '~/types';

export function isTreeCollection(tree: Tree): tree is CollectionTree {
  return Object.hasOwnProperty.call(tree, 'types');
}

export function isElement(item: any): item is Element {
  return (
    typeof item === 'object' &&
    item !== null &&
    Object.hasOwnProperty.call(item, 'kind')
  );
}

export function isElementService(element: Element): element is Service {
  return ['query', 'mutation', 'subscription'].includes(element.kind);
}

export function isElementType(element: Element): element is Type {
  return ['error', 'request', 'response'].includes(element.kind);
}

export function isServiceQuery(service: Service): service is QueryService {
  return service.kind === 'query';
}

export function isServiceMutation(
  service: Service
): service is MutationService {
  return service.kind === 'mutation';
}

export function isServiceSubscription(
  service: Service
): service is SubscriptionService {
  return service.kind === 'subscription';
}

export function isServiceImplementation(
  service: Service
): service is ServiceImplementation {
  return (
    Object.hasOwnProperty.call(service, 'resolve') &&
    typeof (service as any).resolve === 'function'
  );
}

export function isTypeError(type: Type): type is ErrorType {
  return type.kind === 'error';
}

export function isTypeRequest(type: Type): type is RequestType {
  return type.kind === 'request';
}

export function isTypeResponse(type: Type): type is ResponseType {
  return type.kind === 'response';
}

export function isTypeImplementation(type: Type): type is TypeImplementation {
  return (
    isTypeError(type) ||
    isTypeRequest(type) ||
    !type.children ||
    Object.values(type.children).reduce((acc: boolean, service) => {
      return acc && isServiceImplementation(service);
    }, true)
  );
}
