import { type ReactNode, useCallback, useEffect } from 'react';

import { AppConfig } from '@/constants/appConfig';
import { useFetchListCallback } from '@/hooks/useFetchListCallBack';
import { useAllLists } from '@/state/lists/hooks';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const lists = useAllLists();
  const fetchList = useFetchListCallback();
  const fetchAllListsCallback = useCallback(() => {
    Object.keys(lists).forEach((url) => {
      fetchList(url).catch((error) =>
        console.debug('interval list fetching error', error),
      );
    });
  }, [fetchList, lists]);

  useEffect(() => {
    fetchAllListsCallback();
  }, []);
  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      {props.meta}

      <div className="mx-auto max-w-screen-md">
        <header className="border-b border-gray-300">
          <div className="pb-8 pt-16">
            <h1 className="text-3xl font-bold text-gray-900">
              {AppConfig.title}
            </h1>
            <h2 className="text-xl">{AppConfig.description}</h2>
          </div>
        </header>

        <main className="content py-5 text-xl">{props.children}</main>

        <footer className="border-t border-gray-300 py-8 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}. Made with
          Chaos and{' '}
          <a href="https://github.com/ixartz/Next-js-Boilerplate">
            CreativeDesignsGuru&apos;s Boilerplate.
          </a>
        </footer>
      </div>
    </div>
  );
};

export { Main };
