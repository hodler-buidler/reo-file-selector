import { File, FilesStructureItem, Folder } from '@/types/filesStructure';

export type SortItemsFunction = (items: FilesStructureItem[]) => FilesStructureItem[];
export type ShouldHideFolderFunction = (folder: Folder) => boolean;
export type ShouldHideFileFunction = (file: File) => boolean;
export type CanInteractWithItemFunction = (item: FilesStructureItem) => boolean;

export enum Mode {
  Default = 'default',
}

export enum Theme {
  Default = 'default',
}

export enum Size {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}
