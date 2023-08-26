import { createSlice } from '@reduxjs/toolkit';
import { ZeroAddress } from 'ethers';

import type { SupportedChainsType } from '@/constants/network';
import { isAddress } from '@/utils';

export interface ApplicationState {
  readonly chainId: SupportedChainsType;
  readonly account: string | null;
}

const initialState: ApplicationState = {
  chainId: 1,
  account: ZeroAddress,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateChainId(state, action) {
      const { chainId } = action.payload;
      state.chainId = chainId;
    },
    setAccount(state, action) {
      const { account } = action.payload;
      if (!isAddress(account)) state.account = ZeroAddress;

      state.account = account;
    },
  },
});

export const { updateChainId, setAccount } = applicationSlice.actions;
export default applicationSlice.reducer;
