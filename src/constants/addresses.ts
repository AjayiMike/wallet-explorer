import { SupportedChainId } from './network';

type AddressMap = { [chainId: number]: string };

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.OPTIMISM]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.POLYGON]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.BSC]: '0xF7bbE3359443565954b0daC61756931581F3699C',
  [SupportedChainId.ARBITRUM_ONE]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
};
