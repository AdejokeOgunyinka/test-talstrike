import Index from "@/features/Profile";
import { getSession } from "next-auth/react";

const Profile = () => {
  return <Index />;
};

export default Profile;

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
