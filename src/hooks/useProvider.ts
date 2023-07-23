import { RPC_PROVIDERS } from '@/constants/providers';
import type { AppState } from '@/state';
import { useAppSelector } from '@/state/hooks';

const useProvider = () => {
  const chainId = useAppSelector(
    (state: AppState) => state.application.chainId,
  );
  return RPC_PROVIDERS[chainId];
};

export default useProvider;
