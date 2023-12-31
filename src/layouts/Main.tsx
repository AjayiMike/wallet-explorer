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
        console.debug('list fetching error', error),
      );
    });
  }, [fetchList, lists]);

  useEffect(() => {
    fetchAllListsCallback();
  }, []);
  return (
    <div className="w-full px-4 text-white antialiased">
      {props.meta}

      <div className="mx-auto max-w-screen-md">
        <header>
          <div className="py-8">
            <h1 className="text-3xl font-bold">{AppConfig.title}</h1>
            <h2 className="text-xl">{AppConfig.description}</h2>
          </div>
        </header>

        <main className="content py-5 text-xl">{props.children}</main>

        <footer className="border-t border-gray-300 py-8 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}. Crafted
          with code, chaos, and an unholy amount of memes 🚀💻😂
        </footer>
      </div>
    </div>
  );
};

export { Main };
