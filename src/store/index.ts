import { APP_STORE_WINDOW_KEY } from '@/config/app';
import { ToRefs } from 'vue';
import { state as app, State as AppStore } from './modules/app';
import { state as filesStructure, State as FilesStructureStore } from './modules/filesStructure';
import { logAction } from './plugins';
import { PluginFunction, UseStoreCallback } from './types';

export type Store = {
  filesStructure: ToRefs<FilesStructureStore>;
  app: ToRefs<AppStore>;
};

export const store: Store = {
  filesStructure,
  app,
};

export const plugins: PluginFunction[] = [];
if (process.env.NODE_ENV === 'development') plugins.push(logAction);

export function createStore(): void {
  (window as any)[APP_STORE_WINDOW_KEY] = store;
}

export function useAppStore<T>(cb: UseStoreCallback<T, Store>): T {
  return cb(store);
}
