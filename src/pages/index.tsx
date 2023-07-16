import ChainDropdown from '@/components/chainsDropdown';
import TokenComponent from '@/components/tokenComponent';
import WalletInput from '@/components/walletInput';
import { AppConfig } from '@/constants/appConfig';
import { Main } from '@/layouts/Main';
import { Meta } from '@/layouts/Meta';

const Index = () => {
  return (
    <Main
      meta={
        <Meta title={AppConfig.title} description={AppConfig.description} />
      }
    >
      <div className="">
        <WalletInput value="" onChange={() => {}} />
        <div className="flex justify-end">
          <ChainDropdown />
        </div>
        <div className="">
          {new Array(10).fill(undefined).map((_, index) => (
            <TokenComponent key={index} />
          ))}
        </div>
      </div>
    </Main>
  );
};

export default Index;
