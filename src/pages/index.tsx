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
      App
    </Main>
  );
};

export default Index;
