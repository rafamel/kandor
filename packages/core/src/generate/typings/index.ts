import fs from 'fs';
import { CollectionTree } from '~/types';
import { compileTypings } from './compile';

export async function writeTypings(
  dest: string,
  collection: CollectionTree
): Promise<void> {
  fs.writeFileSync(dest, await generateTypings(collection));
}

export async function generateTypings(
  collection: CollectionTree
): Promise<string> {
  return (await compileTypings(collection.types)).trim() + '\n';
}
