import { GetServerSideProps } from "next";
import { getProviders, getSession } from "next-auth/react";
import { ProviderType } from "next-auth/providers";

import SignUp from "@/features/Auth/Signup/Signup";
import AuthLayout from "@/layout/Auth/AuthLayout";

const Signup = (providers: ProviderType) => {
  return (
    <AuthLayout>
      <SignUp providers={Object.values(providers)} />
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
