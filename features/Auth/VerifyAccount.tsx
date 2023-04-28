/* eslint-disable no-unused-vars */

import { useEffect, useState, CSSProperties } from "react";
import NextImage from "next/image";
import { useRouter } from "next/router";
import BeatLoader from "react-spinners/BeatLoader";

import TalstrikeLogo from "@/assets/TalstrikeLogo.svg";
import notify from "@/libs/toast";
import { axios } from "@/libs/axios";

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

  useEffect(() => {
    if (verificationToken) {
      setIsVerifyingEmail(true);
      axios
        .post("/auth/users/verify/", { token: token })
        .then((res) => {
          const data = res?.data;
          localStorage.setItem("verificationToken", data?.access);
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
    <div className="max-w-md pt-[50px] w-full lg:pt-[102px] pl-[20px] lg:pl-[50px] pr-[20px] lg:pr-[unset]">
      <div className="w-full">
        <NextImage src={TalstrikeLogo} alt="talstrike" width="74" height="48" />
        <div className="mt-[47px] text-[32px] leading-[48px] text-brand-70 font-bold">
          Verify email
        </div>
        <p className="text-[20px] text-brand-50 font-light mb-[20px]">
          Please be patient while we verify your email. You should get a
          notification soon about the result of our verification...
        </p>
        {isVerifyingEmail && (
          <BeatLoader
            color={"orange"}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
        {showContinueBtn && (
          <a
            type="submit"
            className="h-[40px] bg-brand-600 rounded-[7px] w-full md:w-[232px] font-light text-[14px] text-white border border-[rgba(217, 217, 217, 0.97)] mb-[12px]"
            href={"/signup/setup"}
          >
            Setup your profile
          </a>
        )}
      </div>
    </div>
  );
};

export default Index;
