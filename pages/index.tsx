import { ProviderType } from "next-auth/providers";

import AuthLayout from "@/layout/Auth/AuthLayout";
import Login from "@/features/Auth/Login";

const Index = (providers: ProviderType) => {
  return (
    <AuthLayout>
      <Login providers={Object.values(providers)} />
    </AuthLayout>
  );
};

export default Index;
