import { createSlice } from '@reduxjs/toolkit';
import { ZeroAddress } from 'ethers';

import type { SupportedChainsType } from '@/constants/network';
import { isAddress } from '@/utils';

export interface ApplicationState {
  readonly chainId: SupportedChainsType;
  readonly address: string | null;
}

const initialState: ApplicationState = {
  chainId: 1,
  address: ZeroAddress,
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
      if (!isAddress(account)) state.address = account;

      state.address = ZeroAddress;
    },
  },
});

export const { updateChainId } = applicationSlice.actions;
export default applicationSlice.reducer;
