import type { AppMessage } from '@/types/app';
import { reactive, toRefs } from 'vue';

export type State = {
  messages: AppMessage[];
  isFilesStructureModalOpened: boolean;
};

export const state = toRefs(
  reactive<State>({
    messages: [],
    isFilesStructureModalOpened: false,
  }),
);
