export type ActionFunction<T, K> = (payload: T) => K;
export type PluginFunction = (options: PluginOptions) => void;
export type CreateActionOptions = {
  name: string;
  state?: Record<string, any>;
};
export type PluginOptions = CreateActionOptions & {
  state: Record<string, any>;
};
export type NameSpaceFunction = (name?: string) => string;
export type UseStoreCallback<T, K> = (store: K) => T;
