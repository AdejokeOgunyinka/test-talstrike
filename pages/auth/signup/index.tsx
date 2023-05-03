import { GetServerSideProps } from "next";
import { getProviders, getSession } from "next-auth/react";
import { ProviderType } from "next-auth/providers";

import AuthLayout from "@/layout/NewAuth/AuthLayout";
import SignupBanner from "@/features/Auth/Signup/NewSignupBanner";

const Signup = (providers: ProviderType) => {
  return (
    <AuthLayout>
      <SignupBanner providers={providers} />
    </AuthLayout>
  );
};

export default Signup;

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
