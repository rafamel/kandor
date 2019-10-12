import fs from 'fs';
import { CollectionTreeApplication } from '~/types';
import { compileTypings } from './compile';

export async function writeTypings(
  dest: string,
  collection: CollectionTreeApplication
): Promise<void> {
  fs.writeFileSync(dest, await generateTypings(collection));
}

export async function generateTypings(
  collection: CollectionTreeApplication
): Promise<string> {
  return (await compileTypings(collection.types)).trim() + '\n';
}
