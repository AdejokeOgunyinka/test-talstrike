import { ProviderType } from "next-auth/providers";

import AuthLayout from "@/layout/Auth/AuthLayout";
import Login from "@/features/Auth/Login";
import LandingPageLayout from "@/layout/LandingPage";

const Index = () => {
  return <LandingPageLayout />;
};

export default Index;
