import type { Token } from '@uniswap/sdk-core';
import { useMemo } from 'react';

import { useAppSelector } from '@/state/hooks';
import type { TokenAddressMap } from '@/state/lists/hooks';
import { useCombinedList } from '@/state/lists/hooks';

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap): {
  [address: string]: Token;
} {
  const chainId = useAppSelector((state) => state.application.chainId);
  return useMemo(() => {
    // reduce to just tokens
    return Object.keys(tokenMap[chainId] ?? {}).reduce<{
      [address: string]: Token;
    }>((newMap, address) => {
      newMap[address] = tokenMap[chainId]![address]!.token;
      return newMap;
    }, {});
  }, [chainId, tokenMap]);
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedList();
  const tokensFromMap = useTokensFromMap(allTokens);
  return tokensFromMap;
}
