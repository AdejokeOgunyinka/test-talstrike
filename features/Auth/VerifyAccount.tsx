/* eslint-disable no-unused-vars */

import { useEffect, useState, CSSProperties } from "react";
import NextImage from "next/image";
import { useRouter } from "next/router";

import TalstrikeLogo from "@/assets/TalstrikeLogoSetup.svg";
import notify from "@/libs/toast";
import { axios } from "@/libs/axios";
import PageLoader from "@/components/Loader";

const Index = () => {
  const router = useRouter();
  const { token } = router.query;

  const [verificationToken, setVerificationToken] = useState("");
  useEffect(() => {
    setVerificationToken(token as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "orange",
  };

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [showContinueBtn, setShowContinueBtn] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<any>();

  useEffect(() => {
    if (verificationToken) {
      setIsVerifyingEmail(true);
      axios
        .post("/auth/users/verify/", { token: token })
        .then((res) => {
          const data = res?.data;
          localStorage.setItem("verificationToken", data?.access);
          setVerifiedUser(data?.user);
          localStorage.setItem("verifiedUser", JSON.stringify(data?.user));
          localStorage?.setItem("verifiedUserID", data?.user?.id);
          notify({
            type: "success",
            text: "Your account has been successfully verified. Please click the button below to complete your profile.",
          });
          setShowContinueBtn(true);
        })
        .catch((err) => {
          notify({ type: "error", text: err?.message });
        })
        .finally(() => setIsVerifyingEmail(false));
    }
  }, [verificationToken]);

  return (
    <>
      {isVerifyingEmail ? (
        <PageLoader />
      ) : (
        <div className="pt-[30px] w-full h-full lg:pt-[110px] flex flex-col items-center">
          <h3 className="mb-[50px] text-brand-600 text-[20px] leading-[168.5%] font-bold">
            Welcome onboard, {verifiedUser?.firstname}
          </h3>
          <p className="text-brand-600 font-medium leading-[32px] mb-[60px]">
            You are just one step away. Please complete your profile set up by
            letting us know more about you as a sports professional. This
            process should take you about{" "}
            <b className="font-medium text-brand-1650">5 mins</b> to complete.
          </p>
          <a href={"/auth/signup/setup"}>
            <button className="bg-brand-600 w-[171px] h-[37px] rounded-[4px] text-brand-500 text-[14px] leading-[21px] font-medium">
              Proceed
            </button>
          </a>
          <div className="mt-[120px] w-full flex justify-center items-center">
            <NextImage src={TalstrikeLogo} alt="logo" />
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
