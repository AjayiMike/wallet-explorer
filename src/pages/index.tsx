import type { Currency, Token } from '@uniswap/sdk-core';
import type { CSSProperties } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { FixedSizeList } from 'react-window';

import ChainDropdown from '@/components/chainsDropdown';
import TokenLogo from '@/components/tokenLogo';
import WalletInput from '@/components/walletInput';
import { AppConfig } from '@/constants/appConfig';
import { useAllTokens } from '@/hooks/tokens';
import useCurrencyBalance, {
  useAllTokenBalances,
} from '@/hooks/useCurrencyBalance';
import { Main } from '@/layouts/Main';
import { Meta } from '@/layouts/Meta';
import { useAppSelector } from '@/state/hooks';
import { currencyKey } from '@/utils';
import { tokenComparator } from '@/utils/sorting';

const Index = () => {
  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();
  const allTokens = useAllTokens();
  const tokensArray = Object.values(allTokens);
  const [balances, balancesAreLoading] = useAllTokenBalances();

  // console.log({ balances, balancesAreLoading });

  // console.log({ allTokens });

  const sortedTokens: Token[] = useMemo(
    () =>
      !balancesAreLoading
        ? tokensArray.sort(tokenComparator.bind(null, balances))
        : [],
    [balances, balancesAreLoading],
  );

  console.log('sortedTokens: ', sortedTokens);

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

  return (
    <Main
      meta={
        <Meta title={AppConfig.title} description={AppConfig.description} />
      }
    >
      <div className="">
        <WalletInput value="" onChange={() => {}} />
        <div className="flex justify-end">
          <ChainDropdown />
        </div>
        <div className="">
          <FixedSizeList
            ref={fixedList as any}
            width="100%"
            height={1200}
            itemData={sortedTokens}
            itemCount={sortedTokens.length}
            itemSize={70}
            itemKey={itemKey}
          >
            {Row}
          </FixedSizeList>
        </div>
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
  const account = useAppSelector((state) => state.application.address);
  const balance = useCurrencyBalance(account ?? undefined, currency);

  return (
    <div style={style} className="flex items-center gap-6 text-base">
      <TokenLogo token={currency} />
      <div className="flex flex-col">
        <span className="font-bold">{currency.symbol}</span>
        <span className="text-sm">{currency.name}</span>
      </div>
      <div className="flex-1 text-right font-semibold">
        {balance?.toFixed(3)}
      </div>
    </div>
  );
}

export default Index;
