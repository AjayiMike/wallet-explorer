import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { AppState } from '@/state';
import { useAppSelector } from '@/state/hooks';

import useProvider from './useProvider';

const MISSING_PROVIDER = Symbol();
const BlockNumberContext = createContext<
  | {
      value?: number;
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER);

function useBlockNumberContext() {
  const blockNumber = useContext(BlockNumberContext);
  if (blockNumber === MISSING_PROVIDER) {
    throw new Error(
      'BlockNumber hooks must be wrapped in a <BlockNumberProvider>',
    );
  }
  return blockNumber;
}

/** Requires that BlockUpdater be installed in the DOM tree. */
export default function useBlockNumber(): number | undefined {
  return useBlockNumberContext().value;
}

export function BlockNumberProvider({ children }: { children: ReactNode }) {
  const activeChainId = useAppSelector(
    (state: AppState) => state.application.chainId,
  );
  const provider = useProvider();
  const [{ chainId, block }, setChainBlock] = useState<{
    chainId?: number;
    block?: number;
  }>({ chainId: activeChainId });

  const onBlock = useCallback(
    (block: number) => {
      setChainBlock((chainBlock) => {
        if (chainBlock.chainId === activeChainId) {
          if (!chainBlock.block || chainBlock.block < block) {
            return { chainId: activeChainId, block };
          }
        }
        return chainBlock;
      });
    },
    [activeChainId, setChainBlock],
  );

  useEffect(() => {
    let stale = false;

    if (provider && activeChainId) {
      // If chainId hasn't changed, don't clear the block. This prevents re-fetching still valid data.
      setChainBlock((chainBlock) =>
        chainBlock.chainId === activeChainId
          ? chainBlock
          : { chainId: activeChainId },
      );

      provider
        .getBlockNumber()
        .then((block) => {
          if (!stale) onBlock(block);
        })
        .catch((error) => {
          console.error(
            `Failed to get block number for chainId ${activeChainId}`,
            error,
          );
        });

      provider.on('block', onBlock);
      return () => {
        stale = true;
        provider.removeListener('block', onBlock);
      };
    }

    return void 0;
  }, [activeChainId, provider, onBlock, setChainBlock]);

  const blockValue = useMemo(
    () => (chainId === activeChainId ? block : undefined),
    [activeChainId, block, chainId],
  );
  const value = useMemo(() => ({ value: blockValue }), [blockValue]);
  return (
    <BlockNumberContext.Provider value={value}>
      {children}
    </BlockNumberContext.Provider>
  );
}
