import { createAction, createNameSpace } from '@/store/utils';
import { AppMessage, AppMessageType } from '@/types/app';
import { Partial } from '@/types/general';
import { state } from './state';

export const namespace = createNameSpace('app');

export const addMessage = createAction(
  (message: Partial<AppMessage>) => {
    state.messages.value.push({
      type: AppMessageType.Info,
      title: '',
      description: '',
      placement: 'topRight',
      ...message,
    });
  },
  { name: namespace('addMessage') },
);

export const popMessagesStack = createAction(
  () => {
    if (state.messages.value.length) {
      state.messages.value.splice(0, 1);
    }
  },
  { name: namespace('popMessagesStack') },
);

export const printError = createAction(
  (message: Partial<AppMessage>) => {
    addMessage({
      type: AppMessageType.Error,
      ...message,
    });
  },
  { name: namespace('printError') },
);

export const printWarning = createAction(
  (message: Partial<AppMessage>) => {
    addMessage({
      type: AppMessageType.Warning,
      ...message,
    });
  },
  { name: namespace('printWarning') },
);

export const printSuccess = createAction(
  (message: Partial<AppMessage>) => {
    addMessage({
      type: AppMessageType.Success,
      ...message,
    });
  },
  { name: namespace('printSuccess') },
);

export const printInfo = createAction(
  (message: Partial<AppMessage>) => {
    addMessage({
      type: AppMessageType.Info,
      ...message,
    });
  },
  { name: namespace('printInfo') },
);

export const setIsFilesStructureModalOpened = createAction(
  (isOpened: boolean) => {
    state.isFilesStructureModalOpened.value = isOpened;
  },
  { name: namespace('setIsFilesStructureModalOpened') },
);

export const openFilesStructureModal = createAction(() => setIsFilesStructureModalOpened(true), {
  name: namespace('openFilesStructureModal'),
});

export const closeFilesStructureModal = createAction(() => setIsFilesStructureModalOpened(false), {
  name: namespace('closeFilesStructureModal'),
});
