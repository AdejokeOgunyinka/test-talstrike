import NextImage from "next/image";
import BeatLoader from "react-spinners/BeatLoader";

import TalstrikeLogo from "@/assets/TalstrikeLogo.svg";
import { useRouter } from "next/router";
import { useTypedSelector } from "@/hooks/hooks";
import { useResendVerification } from "@/api/auth";
import notify from "@/libs/toast";

const ConfirmEmail = () => {
  const router = useRouter();
  const { userInfo } = useTypedSelector((state) => state.auth);

  const { mutate: resendVerification, isLoading: isResendingVerification } =
    useResendVerification();

  return (
    <div className="max-w-lg pt-[50px] w-full lg:pt-[102px] pl-[20px] lg:pl-[50px] pr-[20px] lg:pr-[unset]">
      <div className="w-full">
        <NextImage src={TalstrikeLogo} alt="talstrike" width="74" height="48" />
        <div className="mt-[47px] mb-[27px] text-[32px] leading-[48px] text-brand-70 font-bold">
          Confirm your email address
        </div>
        <p className="text-[16px] text-brand-50 font-light">
          To continue creating your profile, click on the{" "}
          <b className="font-bold">verification link</b> we sent to{" "}
          <b className="text-brand-600 font-bold">{userInfo?.user?.email}</b>
        </p>

        <p className="text-[16px] leading-[18px] text-brand-50 font-normal mt-[26px] mb-[27px]">
          Didn’t receive the confirmation link email?{" "}
          <b
            className="text-brand-600 font-bold cursor-pointer"
            onClick={() =>
              resendVerification(userInfo?.user?.email as string, {
                onSuccess: () =>
                  notify({
                    type: "success",
                    text: "Verification email sent successfully",
                  }),
              })
            }
          >
            {isResendingVerification ? (
              <BeatLoader
                color={"orange"}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Resend"
            )}
          </b>
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
