import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import type { TokenList } from 'tokenList';

export const fetchTokenList: Readonly<{
  pending: ActionCreatorWithPayload<{ url: string; requestId: string }>;
  fulfilled: ActionCreatorWithPayload<{
    url: string;
    tokenList: TokenList;
    requestId: string;
  }>;
  rejected: ActionCreatorWithPayload<{
    url: string;
    errorMessage: string;
    requestId: string;
  }>;
}> = {
  pending: createAction('lists/fetchTokenList/pending'),
  fulfilled: createAction('lists/fetchTokenList/fulfilled'),
  rejected: createAction('lists/fetchTokenList/rejected'),
};
