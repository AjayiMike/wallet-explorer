const TokenComponent = () => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
        alt="token icon"
        className="h-8 w-8"
      />
      <div>
        <div className="flex flex-col justify-center">
          <span className="font-medium">USDT</span>
          <span className="text-sm text-gray-500">ETH</span>
        </div>
      </div>
      <div className="flex w-full grow flex-col items-end justify-center">
        <div className="text-sm font-medium">543.3 USDT</div>
        <div className="text-sm text-gray-500">$542</div>
      </div>
    </div>
  );
};

export default TokenComponent;
