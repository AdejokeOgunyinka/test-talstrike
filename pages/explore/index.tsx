import Index from "@/features/Explore";
import { getSession } from "next-auth/react";

const Explore = () => {
  return <Index />;
};

export default Explore;

export async function getServerSideProps({ req }: { req: any }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: { session },
  };
}
