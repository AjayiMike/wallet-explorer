import { configureStore } from '@reduxjs/toolkit';

import { multicall } from '@/multicall';

import application from './application/reducer';
import lists from './lists/reducer';

export const store = configureStore({
  reducer: {
    application,
    lists,
    multicall: multicall.reducer,
  },
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
