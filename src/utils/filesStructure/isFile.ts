import { File, FilesStructure, Folder } from '@/types/filesStructure';

export function isFile(item: File | Folder | FilesStructure): item is File {
  return !('files' in item);
}
