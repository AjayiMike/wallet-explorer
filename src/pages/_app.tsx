import '../styles/global.css';

import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';

import { BlockNumberProvider } from '@/hooks/useBlockNumber';
import MulticallUpdater from '@/multicall';

import { store } from '../state';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ReduxProvider store={store}>
    <BlockNumberProvider>
      <MulticallUpdater />
      <Component {...pageProps} />
    </BlockNumberProvider>
  </ReduxProvider>
);

export default MyApp;
