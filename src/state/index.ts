import { configureStore } from '@reduxjs/toolkit';

// import { load, save } from 'redux-localstorage-simple';
import { multicall } from '@/multicall';

import application from './application/reducer';
import lists from './lists/reducer';

// const PERSISTED_KEYS: string[] = ['application', 'lists'];
// const PERSISTED_NAMESPACE = 'wallet_explorer';

export const store = configureStore({
  reducer: {
    application,
    lists,
    multicall: multicall.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
    }),
  //   .concat(
  //     save({
  //       states: PERSISTED_KEYS,
  //       namespace: PERSISTED_NAMESPACE,
  //       debounce: 1000,
  //     }),
  //   ),
  // preloadedState: load({
  //   states: PERSISTED_KEYS,
  //   namespace: PERSISTED_NAMESPACE,
  //   disableWarnings: true,
  // }),
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
