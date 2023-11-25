import { DashboardLayout } from "@/layout/Dashboard";
import { getSession } from "next-auth/react";
import PostPage from "@/features/Post";

export const Index = () => {
  return (
    <DashboardLayout>
      <PostPage />
    </DashboardLayout>
  );
};

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

export default Index;
