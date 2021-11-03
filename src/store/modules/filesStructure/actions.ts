import { createAction, createNameSpace } from '@/store/utils';
import type { FilesStructure } from '@/types/filesStructure';
import { state } from './state';

export const namespace = createNameSpace('filesStructure');

export const setFilesStructure = createAction(
  (filesStructure: FilesStructure) => {
    state.filesStructure.value = { ...filesStructure };
  },
  { name: namespace('setFilesStructure') },
);

export const setFilesStructureLoading = createAction(
  (isLoading: boolean) => {
    state.isFilesStructureLoading.value = isLoading;
  },
  { name: namespace('setFilesStructureLoading') },
);
