import React from 'react';

interface WalletInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const WalletInput = ({ value, onChange }: WalletInputProps) => {
  return (
    <div className="relative mb-8 rounded-md shadow-sm">
      <input
        type="text"
        name="wallet_address"
        id="wallet_address"
        className="block w-full rounded-md border-gray-300 p-2 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Paste a wallet address here"
        value={value}
        onChange={onChange}
        style={{ backgroundColor: '#f3f4f6', color: '#1f2937' }}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z"
            clipRule="evenodd"
          />
          <path d="M9.293 7.293a1 1 0 011.414 0l3.5 3.5a1 1 0 01-1.414 1.414l-3.5-3.5a1 1 0 010-1.414z" />
          <path d="M9.293 12.707a1 1 0 000-1.414l-3.5-3.5a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0z" />
        </svg>
      </div>
    </div>
  );
};

export default WalletInput;