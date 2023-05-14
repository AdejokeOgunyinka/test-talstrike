import Index from "@/features/Achievements";
import { getSession } from "next-auth/react";

const Agents = () => {
  return <Index />;
};

export default Agents;

export async function getServerSideProps({ req }: { req: any }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  return {
    props: { session },
  };
}
