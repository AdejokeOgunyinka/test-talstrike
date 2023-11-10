/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useEffect, useRef, useState } from "react";
import { useResendVerification } from "@/api/auth";
import { useTypedSelector } from "@/hooks/hooks";
import Signup from "@/features/Auth/Signup/NewSignup";
import notify from "@/libs/toast";
import SignupIndicators from "./SignupIndicators";

const SignupBanner = ({ providers }: { providers: any }) => {
  // eslint-disable-next-line react/jsx-key
  const [currScreen, setCurrScreen] = useState("");

  const setupInstructions = [
    {
      header: "Join Us",
      description: "Step into the Game. Begin Your Journey with Talstrike!",
    },
    {
      header: "Email Confirmation",
      description:
        "Ready to Score? We've Passed You the Ball. Check Your Inbox and Click the Confirmation Link.",
    },
    {
      header: "Set Up",
      description:
        "Game plan locked in! Touchdown on setting up. Just a quick 5-minute warm-up, and you'll be ready to dive into your sports adventure.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const delay = 3700;

  const timeoutRef = useRef<any>(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setActiveIndex((prevIndex) =>
          prevIndex === setupInstructions.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [activeIndex, setupInstructions.length]);

  const { userInfo } = useTypedSelector((state) => state.auth);

  const { mutate: resendVerification, isLoading: isResendingVerification } =
    useResendVerification();

  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds > 0 && currScreen === "confirmEmail") {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (seconds === 0 && currScreen === "confirmEmail") {
      setCurrScreen("");
    } else {
      setSeconds(60);
    }
  });

  return (
    <>
      {currScreen === "" && (
        <div className="pt-[25px] md:pt-[65px]  relative w-full h-full flex flex-col items-center lg:px-[70px] xl:px-[140px] px-[20px]">
          <h3 className="mb-[30px] text-brand-600 font-semibold text-[26px] md:text-[30px] leading-[36px]">
            Getting Started
          </h3>
          <p className="mb-[33px] xl:mb-[93px] text-[18px] text-[#94AEC5] text-center md:text-start leading-[132.5%]">
            Anyone Can Make an Impact, and You Can Too.
          </p>
          <h5 className="mb-[40px] text-[20px] md:text-[22px] text-center md:text-start font-semibold">
            Create and set up your account in 3 easy steps
          </h5>
          <div className="h-[42px] mb-[30px] md:mb-[60px] flex items-center">
            {setupInstructions?.map((setup, index) => (
              <React.Fragment key={index}>
                <div
                  className="flex py-[10px] max-h-[58px] md:max-h-[unset] px-[15px] md:px-[30.5px] rounded-[100px] text-center text-[12px] md:text-[14px] leading-[21px]"
                  style={{
                    background: index === activeIndex ? "#00B127" : "unset",
                    border: "1.3px solid #00B127",
                    color: index === activeIndex ? "#fff" : "#00B127",
                  }}
                >
                  {setup.header}
                </div>
                {index !== setupInstructions?.length - 1 && (
                  <img src={"/signUpVector.svg"} alt="vector" className="" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p
            style={{ transform: "rotate(0.01deg)" }}
            className="text-center text-[18px] md:text-[16px] leading-[168.5%] md:leading-[27px]"
          >
            {setupInstructions[activeIndex]?.description}
          </p>

          <div className="w-full mt-[80px] xl:mt-[166px] pb-[20px] md:pb-[65px]">
            <div className="w-full justify-center flex gap-[13px] mb-[15px]">
              <a
                href="/"
                className="w-[135px] flex items-center justify-center h-[40px] border-[1.5px] rounded-[4px] border-brand-1650 text-brand-1650 text-[18px]"
              >
                Back
              </a>
              <button
                onClick={() => setCurrScreen("signup")}
                className="w-[135px] h-[40px] bg-brand-600 text-brand-500 rounded-[4px] text-[18px]"
              >
                Continue
              </button>
            </div>

            <p className="text-[18px] text-center">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-brand-600 underline underline-offset-4"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      )}
      {currScreen === "signup" && (
        <Signup
          providers={providers}
          goBack={() => setCurrScreen("")}
          continueSignup={() => setCurrScreen("confirmEmail")}
        />
      )}
      {currScreen === "confirmEmail" && (
        <div className="pt-[50px] h-full w-full flex flex-col lg:pt-[61px] xl:px-[140px] px-[20px]">
          <div className="w-full relative h-[unset] md:h-full">
            <SignupIndicators active={1} />
            <div className="text-[30px] leading-[145%] text-brand-600 font-semibold text-center mt-[28px]">
              Sign Up
            </div>
            <p className="mt-[23px] text-center text-[22px] leading-[168.5%] font-semibold">
              Confirm your email address
            </p>
            <p className="mt-[15px] text-[18px] leading-[32.5px] mb-29px]">
              To continue setting up your profile, please check your email inbox
              for a{" "}
              <b className="text-brand-600 font-normal">verification link</b>{" "}
              sent to{" "}
              <b className="text-brand-600 font-normal">
                {userInfo?.user?.email}
              </b>
            </p>

            <div className="w-full mt-[29px]">
              <p className="text-[18px] leading-[168.5%] text-center">
                Didn’t receive the verification link email?{" "}
                <b
                  onClick={() =>
                    resendVerification(userInfo?.user?.email as string, {
                      onSuccess: () =>
                        notify({
                          type: "success",
                          text: "Verification email sent successfully",
                        }),
                    })
                  }
                  className="text-brand-600 underline cursor-pointer font-normal"
                >
                  Resend
                </b>{" "}
                in {seconds} secs
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupBanner;
