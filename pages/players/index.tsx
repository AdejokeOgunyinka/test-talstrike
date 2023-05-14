import Index from "@/features/Players";
import { getSession } from "next-auth/react";

const Players = () => {
  return <Index />;
};

export default Players;

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
