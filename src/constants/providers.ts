import { deepCopy } from '@ethersproject/properties';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { isPlain } from '@reduxjs/toolkit';

import { CHAIN_IDS_TO_NAMES, RPC_URLS } from './network';

const AVERAGE_L1_BLOCK_TIME = 12000;
type SupportedChainsType = keyof typeof RPC_URLS;

class AppJsonRpcProvider extends StaticJsonRpcProvider {
  private _blockCache = new Map<string, Promise<any>>();

  get blockCache() {
    // If the blockCache has not yet been initialized this block, do so by
    // setting a listener to clear it on the next block.
    if (!this._blockCache.size) {
      this.once('block', () => this._blockCache.clear());
    }
    return this._blockCache;
  }

  constructor(chainId: SupportedChainsType) {
    // Including networkish allows ethers to skip the initial detectNetwork call.
    super(
      RPC_URLS[chainId][0],
      /* networkish= */ { chainId, name: CHAIN_IDS_TO_NAMES[chainId] },
    );

    this.pollingInterval = AVERAGE_L1_BLOCK_TIME;
  }

  send(method: string, params: Array<any>): Promise<any> {
    // Only cache eth_call's.
    if (method !== 'eth_call') return super.send(method, params);

    // Only cache if params are serializable.
    if (!isPlain(params)) return super.send(method, params);

    const key = `call:${JSON.stringify(params)}`;
    const cached = this.blockCache.get(key);
    if (cached) {
      this.emit('debug', {
        action: 'request',
        request: deepCopy({ method, params, id: 'cache' }),
        provider: this,
      });
      return cached;
    }

    const result = super.send(method, params);
    this.blockCache.set(key, result);
    return result;
  }
}

export const RPC_PROVIDERS: {
  [key in SupportedChainsType]: StaticJsonRpcProvider;
} = {
  1: new AppJsonRpcProvider(1),
  137: new AppJsonRpcProvider(137),
  42161: new AppJsonRpcProvider(42161),
  10: new AppJsonRpcProvider(10),
  56: new AppJsonRpcProvider(56),
  43114: new AppJsonRpcProvider(1),
};
