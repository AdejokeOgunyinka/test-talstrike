import Setup from "@/features/Auth/Setup/setupFlow";

import { GetServerSidePropsContext, GetServerSideProps } from "next";
import { getProviders } from "next-auth/react";

const SetupPage = ({ providers }: { providers: any }) => {
  return <Setup providers={Object.values(providers)} />;
};

export default SetupPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return {
    props: { providers: await getProviders() },
  };
};
