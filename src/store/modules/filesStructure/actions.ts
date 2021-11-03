import { ReoAPI } from '@/api/reo';
import { printError } from '@/store/modules/app';
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

export const loadFilesStructure = createAction(
  async () => {
    try {
      setFilesStructureLoading(true);
      state.filesStructure.value = await ReoAPI.fetchFilesStructure();
    } catch (e) {
      printError({
        title: `Network error. Could't fetch files structure.`,
        description: `Please try reload the page.`,
      });
    } finally {
      setFilesStructureLoading(false);
    }
  },
  { name: namespace('loadFilesStructure') },
);
