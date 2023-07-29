import { createReducer } from '@reduxjs/toolkit';
import type { TokenList } from 'tokenList';

import { LIST_URLS } from '@/constants/lists';

import { fetchTokenList } from './actions';

export interface ListsState {
  readonly byUrl: {
    readonly [url: string]: {
      readonly current: TokenList | null;
      readonly pendingUpdate: TokenList | null;
      readonly loadingRequestId: string | null;
      readonly error: string | null;
    };
  };
}

type ListState = ListsState['byUrl'][string];

const NEW_LIST_STATE: ListState = {
  error: null,
  current: null,
  loadingRequestId: null,
  pendingUpdate: null,
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P];
};

const initialState: ListsState = {
  byUrl: {
    ...LIST_URLS.reduce<Mutable<ListsState['byUrl']>>((memo, listUrl) => {
      memo[listUrl] = NEW_LIST_STATE;
      return memo;
    }, {}),
  },
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      fetchTokenList.pending,
      (state, { payload: { requestId, url } }) => {
        const current = state.byUrl[url]?.current ?? null;
        const pendingUpdate = state.byUrl[url]?.pendingUpdate ?? null;

        state.byUrl[url] = {
          current,
          pendingUpdate,
          loadingRequestId: requestId,
          error: null,
        };
      },
    )
    .addCase(
      fetchTokenList.fulfilled,
      (state, { payload: { requestId, tokenList, url } }) => {
        const current = state.byUrl[url]?.current;
        const loadingRequestId = state.byUrl[url]?.loadingRequestId;

        if (current) {
          if (loadingRequestId === null || loadingRequestId === requestId) {
            state.byUrl[url] = {
              current,
              pendingUpdate: tokenList,
              loadingRequestId: null,
              error: null,
            };
          }
        } else {
          state.byUrl[url] = {
            current: tokenList,
            pendingUpdate: null,
            loadingRequestId: null,
            error: null,
          };
        }
      },
    )
    .addCase(
      fetchTokenList.rejected,
      (state, { payload: { url, requestId, errorMessage } }) => {
        if (state.byUrl[url]?.loadingRequestId !== requestId) {
          // no-op since it's not the latest request
          return;
        }

        state.byUrl[url] = {
          current: state.byUrl[url]?.current ?? null,
          pendingUpdate: null,
          loadingRequestId: null,
          error: errorMessage,
        };
      },
    ),
);
