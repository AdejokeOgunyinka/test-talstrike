import Index from "@/features/Coaches";
import { getSession } from "next-auth/react";

const Coaches = () => {
  return <Index />;
};

export default Coaches;

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
