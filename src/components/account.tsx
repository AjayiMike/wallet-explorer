import React from 'react';

import { shortenAddress } from '@/utils';

const Account: React.FC<{ account: string | null }> = ({ account }) => {
  return account ? (
    <div className="rounded-lg border border-[#2F1A3B] bg-[#2F1A3B55] px-4 py-2 text-sm font-medium shadow-sm">
      <span className="sm:hidden">{shortenAddress(account, 6)}</span>
      <span className="hidden sm:block md:hidden">
        {shortenAddress(account, 10)}
      </span>
      <span className="hidden md:block">{shortenAddress(account, 15)}</span>
    </div>
  ) : null;
};

export default Account;
