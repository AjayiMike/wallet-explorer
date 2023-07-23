import { createSlice } from '@reduxjs/toolkit';

import type { SupportedChainsType } from '@/constants/network';

export interface ApplicationState {
  readonly chainId: SupportedChainsType;
}

const initialState: ApplicationState = {
  chainId: 1,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateChainId(state, action) {
      const { chainId } = action.payload;
      state.chainId = chainId;
    },
  },
});

export const { updateChainId } = applicationSlice.actions;
export default applicationSlice.reducer;
