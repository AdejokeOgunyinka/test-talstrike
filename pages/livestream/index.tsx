import Index from "@/features/LiveStream";
import { getSession } from "next-auth/react";

const LiveStream = () => {
  return <Index />;
};

export default LiveStream;

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
