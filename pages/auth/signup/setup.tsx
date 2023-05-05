import AuthSetupLayout from "@/layout/NewAuth/AuthSetupLayout";
import Setup from "@/features/Auth/Signup/Setup/NewSetup";

import { GetServerSidePropsContext, GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";

const SetupPage = ({ providers }: { providers: any }) => {
  return (
    <AuthSetupLayout>
      <Setup providers={Object.values(providers)} />
    </AuthSetupLayout>
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
