import VerifyUserAccount from "@/features/Auth/VerifyAccount";

import AuthSetupLayout from "@/layout/NewAuth/AuthSetupLayout";

const VerifyAccount = () => {
  return (
    <AuthSetupLayout>
      <VerifyUserAccount />
    </AuthSetupLayout>
  );
};

export default VerifyAccount;
