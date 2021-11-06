import { FilesStructure, Folder } from '@/types/filesStructure';

export function findFolderById(
  collection: Folder | FilesStructure,
  folderId: string,
): Folder | null {
  if ('id' in collection && collection.id === folderId) return { ...collection };

  if (!collection.folders.length) return null;

  let result = collection.folders.find((folder) => folder.id === folderId) || null;

  if (result) return { ...result };

  for (let i = 0; i < collection.folders.length; i++) {
    result = findFolderById(collection.folders[i], folderId);
    if (result) return result;
  }

  return null;
}
