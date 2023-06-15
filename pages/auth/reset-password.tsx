import { GetServerSideProps } from "next";
import { ProviderType } from "next-auth/providers";
import { getProviders, getSession } from "next-auth/react";

import AuthLayout from "@/layout/NewAuth/AuthLayout";
import ResetPassword from "@/features/Auth/ResetPassword";

const Index = (providers: ProviderType) => {
  return (
    <AuthLayout>
      <ResetPassword providers={Object.values(providers)} />
    </AuthLayout>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }

  return {
    props: { providers: await getProviders() },
  };
};
