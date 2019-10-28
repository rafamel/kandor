import { waitUntil } from 'promist';

/**
 * Will execute `test` forever until it doesn't throw or reject and returns true, and only then will it execute `fn`.
 */
export function safeTrigger(
  test: () => boolean | Promise<boolean>,
  fn: () => void
): void {
  waitUntil(async () => {
    try {
      return await test();
    } catch (err) {
      return false;
    }
  }).then(() => fn());
}
