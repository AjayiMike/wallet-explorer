import type { TokenList } from 'tokenList';

import uriToHttp from './uriToHttp';

const listCache = new Map<string, TokenList>();

/** Fetches and validates a token list. */
export default async function fetchTokenList(
  listUrl: string,
): Promise<TokenList> {
  const cached = listCache?.get(listUrl); // avoid spurious re-fetches
  if (cached) {
    return cached;
  }
  const urls = uriToHttp(listUrl);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i] as string;
    const isLast = i === urls.length - 1;
    let response;
    try {
      response = await fetch(url, { credentials: 'omit' });
    } catch (error) {
      const message = `failed to fetch list: ${listUrl}`;
      console.debug(message, error);
      if (isLast) throw new Error(message);
      continue;
    }

    if (!response.ok) {
      const message = `failed to fetch list: ${listUrl}`;
      console.debug(message, response.statusText);
      if (isLast) throw new Error(message);
      continue;
    }

    const list = await response.json();
    listCache?.set(listUrl, list);
    return list;
  }

  throw new Error('Unrecognized list URL protocol.');
}
