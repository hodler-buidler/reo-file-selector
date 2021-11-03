import type { AppMessage } from '@/types/app';
import { reactive, toRefs } from 'vue';

export type State = {
  messages: AppMessage[];
};

export const state = toRefs(
  reactive<State>({
    messages: [],
  }),
);
