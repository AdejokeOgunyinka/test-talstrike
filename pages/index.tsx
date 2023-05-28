import { getSession } from "next-auth/react";
import LandingPageLayout from "@/layout/LandingPage";

const Index = () => {
  return <LandingPageLayout />;
};

export default Index;

export async function getServerSideProps({ req }: { req: any }) {
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
    props: { session },
  };
}
