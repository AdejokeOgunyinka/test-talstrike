import { DashboardLayout } from "@/layout/Dashboard";
import Dashboard from "@/features/Dashboard";
import { getSession } from "next-auth/react";

export const Index = () => {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
};

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

export default Index;
