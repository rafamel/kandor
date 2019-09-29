import { FreeItem } from '~/types';

export default function isFreeItem(item: any): item is FreeItem<any> {
  return (
    Object.hasOwnProperty.call(item, 'kind') &&
    Object.hasOwnProperty.call(item, 'item')
  );
}
