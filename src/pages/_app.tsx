import '../styles/global.css';

import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '../state';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ReduxProvider store={store}>
    <Component {...pageProps} />
  </ReduxProvider>
);

export default MyApp;
