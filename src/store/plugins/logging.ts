import { PluginFunction } from '../types';

export const logAction: PluginFunction = (options) => {
  console.log(
    `%c[STATE ACTION]: ${options.name}`,
    'color:green; font-weight: bold; font-size: 16px;',
  );
  console.log(options.state);
};
