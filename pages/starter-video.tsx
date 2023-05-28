import { getProviders, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

import StarterVideo from "@/features/Auth/Signup/StarterVideo";

const StarterVideoPage = () => {
  return <StarterVideo />;
};

export default StarterVideoPage;

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
