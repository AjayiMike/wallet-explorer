import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';

const chains = [
  {
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    chainId: 1,
    explorers: 'https://etherscan.io',
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  },
  {
    name: 'BNB Smart Chain Mainnet',
    shortName: 'BSC',
    chainId: 56,
    explorers: 'https://bscscan.com',
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
  },
  {
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    chainId: 42161,
    explorers: 'https://arbiscan.io',
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  },
  {
    name: 'OP Mainnet',
    shortName: 'Optimism',
    chainId: 10,
    explorers: 'https://optimistic.etherscan.io',
    iconUrl: 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
  },
];

const ChainDropdown = () => {
  const [selectedChain, setSelectedChain] = useState(chains[0]);

  const handleChange = (chain: any) => {
    setSelectedChain(chain);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button className="relative inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <img
              src={selectedChain?.iconUrl}
              alt={selectedChain?.name}
              className="mr-2 h-5 w-5 rounded-full"
            />
            {selectedChain?.shortName}
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
              className="absolute z-10 mt-2 w-56 divide-y rounded-md bg-white shadow-lg focus:outline-none"
            >
              {chains.map((chain, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <button
                      onClick={() => handleChange(chain)}
                      className={`${
                        active
                          ? 'flex items-center bg-gray-100 text-gray-900'
                          : 'flex items-center text-gray-700'
                      } block w-full px-4 py-2 text-sm`}
                      type="button"
                    >
                      <img
                        src={chain.iconUrl}
                        alt={chain.name}
                        className="mr-2 h-5 w-5 rounded-full"
                      />
                      {chain.shortName}
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