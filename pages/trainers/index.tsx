import Index from "@/features/Trainers";
import { getSession } from "next-auth/react";

const Trainers = () => {
  return <Index />;
};

export default Trainers;

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
