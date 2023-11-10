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
        <div className="w-full h-full flex flex-col items-center">
          <h3 className="mb-[50px] text-[22px] leading-[168.5%] font-semibold">
            Welcome onboard, {verifiedUser?.firstname}
          </h3>
          <p className="text-center text-[18px] leading-[32.5px] mb-[36px] w-full md:w-[60%]">
            You are just one step away. Please complete your profile set up by
            letting us know more about you as a sports professional. This
            process should take you about{" "}
            <b className="font-semibold ">5 mins</b> to complete.
          </p>
          <a href={"/auth/signup/setup"}>
            <button className="bg-brand-green w-[171px] h-[45px] rounded-[4px] text-brand-500 text-[18px] leading-[21px]">
              Begin Setup
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
