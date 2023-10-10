import Index from "@/features/Messaging";
import { getSession } from "next-auth/react";

const Messaging = () => {
  return <Index />;
};

export default Messaging;

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
