import { useCallback } from 'react';
import type { TokenList } from 'tokenList';

import { useAppDispatch } from '@/state/hooks';
import { fetchTokenList } from '@/state/lists/actions';
import { generateId } from '@/utils';

import getTokenList from '../utils/fetchTokenList';

export function useFetchListCallback(): (
  listUrl: string,
) => Promise<TokenList> {
  const dispatch = useAppDispatch();
  return useCallback(
    async (listUrl: string) => {
      const requestId = generateId();
      dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(listUrl)
        .then((tokenList) => {
          dispatch(
            fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }),
          );
          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
          dispatch(
            fetchTokenList.rejected({
              url: listUrl,
              requestId,
              errorMessage: error.message,
            }),
          );
          throw error;
        });
    },
    [dispatch],
  );
}
