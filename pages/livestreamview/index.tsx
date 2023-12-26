import Index from "@/features/LiveStream";
import { getSession } from "next-auth/react";

const LiveStreamView = () => {
  return <Index />;
};

export default LiveStreamView;

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
