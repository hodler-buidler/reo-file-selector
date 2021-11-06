import { File, FilesStructure, Folder } from '@/types/filesStructure';

export function findFileById(collection: Folder | FilesStructure, fileId: string): File | null {
  if (!collection.folders.length && !collection.files.length) return null;

  let result = collection.files.find((file) => file.id === fileId) || null;

  if (result) return { ...result };

  for (let i = 0; i < collection.folders.length; i++) {
    result = findFileById(collection.folders[i], fileId);
    if (result) return result;
  }

  return null;
}
