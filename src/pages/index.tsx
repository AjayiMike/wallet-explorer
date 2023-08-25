import type { Currency, Token } from '@uniswap/sdk-core';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';

import ChainDropdown from '@/components/chainsDropdown';
import Loader from '@/components/Spinner';
import TokenLogo from '@/components/tokenLogo';
import WalletInput from '@/components/walletInput';
import { AppConfig } from '@/constants/appConfig';
import type { SupportedChainId } from '@/constants/network';
import { useAllTokens } from '@/hooks/tokens';
import useCurrencyBalance, {
  useAllTokenBalances,
} from '@/hooks/useCurrencyBalance';
import { Main } from '@/layouts/Main';
import { Meta } from '@/layouts/Meta';
import { useApplicationState } from '@/state/application/hooks';
import { setAccount, updateChainId } from '@/state/application/reducer';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { currencyKey, formatCurrencyValue, isAddress } from '@/utils';
import { tokenComparator } from '@/utils/sorting';

const Index = () => {
  const applicationState = useApplicationState();
  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();
  const allTokens = useAllTokens();
  const tokensArray = Object.values(allTokens);
  const [balances, balancesAreLoading] = useAllTokenBalances();

  const dispatch = useAppDispatch();

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = event.clipboardData.getData('text');

      // Validate pasted content
      if (isAddress(pastedText)) {
        dispatch(setAccount({ account: pastedText }));
      }

      // Prevent default paste behavior
      event.preventDefault();
    },
    [],
  );

  const hanldleChainChange = useCallback((chainId: SupportedChainId) => {
    dispatch(updateChainId({ chainId }));
  }, []);

  const sortedTokens: Token[] = useMemo(
    () =>
      !balancesAreLoading
        ? tokensArray.sort(tokenComparator.bind(null, balances))
        : [],
    [balances, balancesAreLoading],
  );

  // tokens are sorted according to balances, fetching token balances takes some times. So we render unsorted token while we wait for them to be sorted
  const renderedToken = useMemo(
    () => (sortedTokens.length ? sortedTokens : tokensArray),
    [sortedTokens],
  );

  const itemKey = useCallback((index: number, data: typeof sortedTokens) => {
    const currency = data[index];
    return currencyKey(currency!);
  }, []);

  interface TokenRowProps {
    data: Array<Currency>;
    index: number;
    style: CSSProperties;
  }

  const Row = useCallback(({ data, index, style }: TokenRowProps) => {
    const token: Currency = data[index]!;
    return <CurrencyRow currency={token} style={style} />;
  }, []);

  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
    <Main
      meta={
        <Meta title={AppConfig.title} description={AppConfig.description} />
      }
    >
      <div>
        <WalletInput
          value={applicationState.account ?? ''}
          handlePaste={handlePaste}
        />
        <div className="flex justify-end">
          <ChainDropdown
            chainId={applicationState.chainId}
            hanldleChainChange={hanldleChainChange}
          />
        </div>
        {!isSSR && (
          <FixedSizeList
            ref={fixedList as any}
            width="100%"
            height={1200}
            itemData={renderedToken}
            itemCount={renderedToken.length}
            itemSize={70}
            itemKey={itemKey}
            overscanCount={30}
          >
            {Row}
          </FixedSizeList>
        )}
      </div>
    </Main>
  );
};

export function CurrencyRow({
  currency,
  style,
}: {
  currency: Currency;
  style?: CSSProperties;
}) {
  const account = useAppSelector((state) => state.application.account);
  const balance = useCurrencyBalance(account ?? undefined, currency);

  return (
    <div style={style} className="flex items-center gap-6 text-base">
      <TokenLogo token={currency} />
      <div className="flex flex-col">
        <span className="font-bold">{currency.symbol}</span>
        <span className="text-sm">{currency.name}</span>
      </div>
      <div
        suppressContentEditableWarning
        className="flex-1 text-right font-semibold"
      >
        {balance ? (
          formatCurrencyValue(Number(balance.toSignificant()))
        ) : (
          <div className="ml-auto w-4">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
