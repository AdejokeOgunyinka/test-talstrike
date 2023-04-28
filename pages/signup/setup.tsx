import Setup from '@/features/Auth/Setup/setupFlow';

import { MainLayout } from '@components/Layout/MainLayout/MainLayout';
import { GetServerSidePropsContext, GetServerSideProps } from 'next';
import { getProviders } from 'next-auth/react';

const SetupPage = ({ providers }) => {
  return (
    <MainLayout>
      <Setup providers={Object.values(providers)} />
    </MainLayout>
  );
};

export default SetupPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: { providers: await getProviders() },
  };
};
