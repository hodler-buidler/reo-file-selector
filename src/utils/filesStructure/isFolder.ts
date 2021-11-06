import { File, FilesStructure, Folder } from '@/types/filesStructure';

export function isFolder(item: File | Folder | FilesStructure): item is Folder {
  return 'files' in item && 'parentFolderId' in item;
}
