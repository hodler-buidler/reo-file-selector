import type { FilesStructure } from '@/types/filesStructure';
import { reactive, toRefs } from 'vue';

export type State = {
  filesStructure: FilesStructure;
  isFilesStructureLoading: boolean;
};

export const state = toRefs(
  reactive<State>({
    filesStructure: {
      folders: [],
      files: [],
    },
    isFilesStructureLoading: false,
  }),
);
