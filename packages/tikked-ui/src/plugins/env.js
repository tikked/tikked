/* eslint-disable no-undef */
export const envSymbol = Symbol();

export default {
  install: (app) => {
    app.config.globalProperties.$env = serverConfig;
    app.provide(envSymbol, serverConfig);
  }
};
