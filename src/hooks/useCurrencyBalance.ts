import { Interface } from '@ethersproject/abi';
import type { Currency, Token } from '@uniswap/sdk-core';
import { CurrencyAmount } from '@uniswap/sdk-core';
import { isAddress } from 'ethers';
import JSBI from 'jsbi';
import { useMemo } from 'react';

import ERC20ABI from '@/abis/erc20.balance.abi.json';
import { useMultipleContractSingleData } from '@/multicall/hooks';
import { useAppSelector } from '@/state/hooks';

import { useAllTokens } from './tokens';

const ERC20Interface = new Interface(ERC20ABI);

const tokenBalancesGasRequirement = { gasRequired: 185_000 };

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[],
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const chainId = useAppSelector((state) => state.application.chainId);
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token =>
          isAddress(t?.address) !== false && t?.chainId === chainId,
      ) ?? [],
    [chainId, tokens],
  );
  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens],
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    useMemo(() => [address], [address]),
    tokenBalancesGasRequirement,
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances],
  );

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{
            [tokenAddress: string]: CurrencyAmount<Token> | undefined;
          }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0];
            const amount = value ? JSBI.BigInt(value.toString()) : undefined;
            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount);
            }
            return memo;
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, balances],
  );
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[],
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

export function useAllTokenBalances(): [
  { [tokenAddress: string]: CurrencyAmount<Token> | undefined },
  boolean,
] {
  const account = useAppSelector((state) => state.application.address);
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens],
  );
  const [balances, balancesIsLoading] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    allTokensArray,
  );
  return [balances ?? {}, balancesIsLoading];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency?.isToken ?? false,
      ) ?? [],
    [currencies],
  );

  const chainId = useAppSelector((state) => state.application.chainId);
  const tokenBalances = useTokenBalances(account, tokens);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency || currency.chainId !== chainId)
          return undefined;
        if (currency.isToken) return tokenBalances[currency.address];
        return undefined;
      }) ?? [],
    [account, chainId, currencies, tokenBalances],
  );
}

export default function useCurrencyBalance(
  account?: string,
  currency?: Currency,
): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency]),
  )[0];
}
