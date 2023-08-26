import { configureStore } from '@reduxjs/toolkit';
import { load, save } from 'redux-localstorage-simple';

import { multicall } from '@/multicall';

import application from './application/reducer';
import lists from './lists/reducer';

const PERSISTED_KEYS: string[] = ['application', 'lists'];
const PERSISTED_NAMESPACE = 'wallet_explorer';

const localstorageMiddleware = save({
  states: PERSISTED_KEYS,
  namespace: PERSISTED_NAMESPACE,
  debounce: 1000,
});

export const store = configureStore({
  reducer: {
    application,
    lists,
    multicall: multicall.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware({
      thunk: true,
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 },
    });

    return typeof localStorage !== 'undefined'
      ? defaultMiddleware.concat(localstorageMiddleware)
      : defaultMiddleware;
  },
  preloadedState:
    typeof localStorage !== 'undefined'
      ? load({ states: PERSISTED_KEYS, namespace: PERSISTED_NAMESPACE })
      : undefined,
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
