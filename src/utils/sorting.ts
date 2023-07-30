import type { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core';

/** Sorts currency amounts (descending). */
function balanceComparator(
  a?: CurrencyAmount<Currency>,
  b?: CurrencyAmount<Currency>,
) {
  if (a && b) {
    return a.greaterThan(b) ? -1 : a.equalTo(b) ? 0 : 1;
  }
  if (a?.greaterThan('0')) {
    return -1;
  }
  if (b?.greaterThan('0')) {
    return 1;
  }
  return 0;
}

type TokenBalances = {
  [tokenAddress: string]: CurrencyAmount<Token> | undefined;
};

/** Sorts tokens by currency amount (descending) then symbol (ascending). */
export function tokenComparator(balances: TokenBalances, a: Token, b: Token) {
  // Sorts by balances
  const balanceComparison = balanceComparator(
    balances[a.address],
    balances[b.address],
  );
  if (balanceComparison !== 0) return balanceComparison;

  // Sorts by symbol
  if (a.symbol && b.symbol) {
    return a.symbol.toLowerCase() < b.symbol.toLowerCase() ? -1 : 1;
  }

  return -1;
}
