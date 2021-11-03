import { FilesStructure } from '@/types/filesStructure';
import { makeHttp } from './http';

export async function fetchFilesStructure(): Promise<FilesStructure> {
  const response = await makeHttp().get<FilesStructure>('/folderStructure');
  return response.data;
}
