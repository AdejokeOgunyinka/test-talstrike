import { getProviders, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

import ConfirmEmail from "@/features/Auth/ConfirmEmail";
import AuthLayout from "@/layout/Auth/AuthLayout";

const ConfirmEmailAddress = () => {
  return (
    <AuthLayout>
      <ConfirmEmail />
    </AuthLayout>
  );
};

export default ConfirmEmailAddress;

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
