export type FilesStructure = {
  folders: Folder[];
  files: File[];
};

export type Folder = {
  id: string;
  name: string;
  parentFolderId: string | null;
  folders: Folder[];
  files: File[];
  createdAt: number;
  updatedAt: number;
};

export type File = {
  id: string;
  name: string;
  utl: string;
  mimeType: string;
  usage: FileUsage;
  floorPlan: null;
  parentFolderId: string;
  createdAt: number;
  updatedAt: number;
};

export enum FileUsage {
  Internal = 'internal',
  External = 'external',
}
