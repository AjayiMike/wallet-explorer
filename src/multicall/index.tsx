import type { ListenerOptions } from '@uniswap/redux-multicall';
import { createMulticall } from '@uniswap/redux-multicall';
import { Contract } from 'ethers';
import { useMemo } from 'react';

import { MULTICALL_ADDRESS } from '@/constants/addresses';
import { SupportedChainId } from '@/constants/network';
import useBlockNumber from '@/hooks/useBlockNumber';
import useProvider from '@/hooks/useProvider';
import type { AppState } from '@/state';
import { useAppSelector } from '@/state/hooks';

import multicallABI from '../abis/uniswap-multicall.json';

export const multicall = createMulticall({ reducerPath: 'multicall' });

function getBlocksPerFetchForChainId(chainId: number | undefined): number {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.OPTIMISM:
      return 15;
    default:
      return 1;
  }
}

const MulticallUpdater = () => {
  const chainId = useAppSelector(
    (state: AppState) => state.application.chainId,
  );
  const blockNumber = useBlockNumber();
  const provider = useProvider();

  const multcallAddress = useMemo(() => MULTICALL_ADDRESS[chainId], [chainId]);
  const listenerOptions: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(chainId),
    }),
    [chainId],
  );
  const uniswapMulticall = new Contract(
    multcallAddress as string,
    multicallABI,
    provider as any,
  );

  return (
    <multicall.Updater
      chainId={chainId}
      latestBlockNumber={blockNumber}
      contract={uniswapMulticall}
      listenerOptions={listenerOptions}
    />
  );
};

export default MulticallUpdater;
