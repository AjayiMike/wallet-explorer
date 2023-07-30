import type { Currency } from '@uniswap/sdk-core';
import { getAddress } from 'ethers';
import type { TokenInfo, TokenList } from 'tokenList';

import { WrappedTokenInfo } from '@/state/lists/wrappedTokenInfo';

export function generateId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);

  return `${timestamp}-${randomStr}`;
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}

type TokenMap = Readonly<{
  [tokenAddress: string]: { token: WrappedTokenInfo; list?: TokenList };
}>;
export type ChainTokenMap = Readonly<{ [chainId: number]: TokenMap }>;

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>;
};
const mapCache =
  typeof WeakMap !== 'undefined'
    ? new WeakMap<TokenList | TokenInfo[], ChainTokenMap>()
    : null;

export function tokensToChainTokenMap(
  tokens: TokenList | TokenInfo[],
): ChainTokenMap {
  const cached = mapCache?.get(tokens);
  if (cached) return cached;

  const [list, infos] = Array.isArray(tokens)
    ? [undefined, tokens]
    : [tokens, tokens.tokens];
  const map = infos.reduce<Mutable<ChainTokenMap>>((map, info) => {
    try {
      const token = new WrappedTokenInfo(info, list);
      if (map[token.chainId]?.[token.address] !== undefined) {
        console.warn(`Duplicate token skipped: ${token.address}`);
        return map;
      }
      if (!map[token.chainId]) {
        map[token.chainId] = {};
      }
      map[token.chainId]![token.address] = { token, list };
      return map;
    } catch {
      return map;
    }
  }, {}) as ChainTokenMap;
  mapCache?.set(tokens, map);
  return map;
}

export function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER';
}
