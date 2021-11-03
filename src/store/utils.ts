import { plugins, store } from './index';
import { ActionFunction, CreateActionOptions, NameSpaceFunction } from './types';

export function createAction<T, K>(action: ActionFunction<T, K>, options: CreateActionOptions) {
  return (payload?: T): K => {
    const result = action(payload as T);
    plugins.forEach((plugin) =>
      plugin({
        ...options,
        state: options.state || store,
      }),
    );
    return result;
  };
}

export function createNameSpace(prefix: string): NameSpaceFunction {
  return (name?: string) => {
    if (!name) return prefix;
    return `${prefix}/${name}`;
  };
}
