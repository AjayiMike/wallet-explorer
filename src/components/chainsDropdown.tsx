import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useMemo } from 'react';

import type { SupportedChainId } from '@/constants/network';

const chains = [
  {
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    chainId: 1,
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  },
  {
    name: 'BNB Smart Chain Mainnet',
    shortName: 'BSC',
    chainId: 56,
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
  },
  {
    name: 'Polygon Mainnet',
    shortName: 'Polygon',
    chainId: 137,
    iconUrl:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
  },
  {
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    chainId: 42161,
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  },
  {
    name: 'OP Mainnet',
    shortName: 'Optimism',
    chainId: 10,
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
  },
];

const ChainDropdown: React.FC<{
  chainId: SupportedChainId;
  hanldleChainChange: (chainId: SupportedChainId) => void;
}> = ({ chainId, hanldleChainChange }) => {
  const activeChainInfo = useMemo(
    () => chains.find((item) => item.chainId === chainId),
    [chainId],
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button className="relative inline-flex justify-center rounded-md border border-[#2F1A3B] bg-[#0D0D0E] px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-[#2F1A3B]">
            <img
              src={activeChainInfo?.iconUrl}
              alt={activeChainInfo?.name}
              className="mr-2 h-5 w-5 rounded-full"
            />
            {activeChainInfo?.shortName}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 z-10 mt-2 w-52 divide-y divide-[#2C2C2E] bg-[#0D0D0E] shadow-lg focus:outline-none"
            >
              {chains.map((chain, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <button
                      onClick={() => hanldleChainChange(chain.chainId)}
                      className={`${
                        active
                          ? 'flex items-center bg-[#2C2C2E]'
                          : 'flex items-center'
                      } block w-full px-4 py-2 text-sm`}
                      type="button"
                    >
                      <img
                        src={chain.iconUrl}
                        alt={chain.name}
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      <span className="whitespace-nowrap">
                        {chain.shortName}
                      </span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ChainDropdown;
