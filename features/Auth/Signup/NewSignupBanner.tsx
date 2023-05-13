/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useRef, useState } from "react";
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
      header: "Sign Up",
      description:
        "First, create an account with your basic information if you don’t have one already on Talstrike.",
    },
    {
      header: "Confirm Email",
      description:
        "Then you get your email verified by clicking the confirmation link sent to your inbox.",
    },
    {
      header: "Set up",
      description:
        "Finally, go through the onboarding process which may take about 5 minutes to complete. And, boom you are ready to explore!",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const delay = 6000;

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
        <div className="pt-[65px] relative w-full h-full flex flex-col items-center xl:px-[140px] px-[20px]">
          <h3 className="mb-[30px] text-brand-1650 font-semibold text-[24px] leading-[36px]">
            Get Started
          </h3>
          <p className="mb-[93px] text-[18px] text-[#94AEC5] font-medium leading-[132.5%]">
            Anyone can strike, you too can!
          </p>
          <h5 className="mb-[40px] text-brand-600 text-[20px] font-bold">
            Create and set up your account in 3 easy steps
          </h5>
          <div className="h-[42px] mb-[60px] flex items-center">
            {setupInstructions?.map((setup, index) => (
              <>
                <div
                  key={index}
                  className="flex py-[10px] h-[58px] md:h-[unset] px-[15px] md:px-[30.5px] rounded-[100px] text-[14px] leading-[21px]"
                  style={{
                    background: index === activeIndex ? "#003D72" : "unset",
                    border: "1.3px solid #003D72",
                    color: index === activeIndex ? "#fff" : "#003D72",
                  }}
                >
                  {setup.header}
                </div>
                {index !== setupInstructions?.length - 1 && (
                  <img src={"/signUpVector.svg"} alt="vector" className="" />
                )}
              </>
            ))}
          </div>
          <p
            style={{ transform: "rotate(0.01deg)" }}
            className="text-brand-600 text-center text-[16px] leading-[27px] font-medium mb-[50px]"
          >
            {setupInstructions[activeIndex]?.description}
          </p>
          <div className="flex gap-[13px]">
            <a
              href="/"
              className="w-[135px] flex items-center justify-center h-[40px] border-[1.5px] rounded-[4px] border-brand-1650 text-brand-1650 text-[14px] font-medium"
            >
              Back
            </a>
            <button
              onClick={() => setCurrScreen("signup")}
              className="w-[135px] h-[40px] bg-brand-600 text-brand-500 rounded-[4px] text-[14px] font-medium"
            >
              Continue
            </button>
          </div>
          <div className="absolute bottom-[62px]">
            <p className="text-[#94AEC5] text-[14px] font-medium leading-[21px]">
              Already have an account?{" "}
              <a href="/auth/login" className="text-[#003D72] underline">
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
            <div className="text-[32px] leading-[48px] text-brand-70 font-bold text-center mb-[31px]">
              Create an account
            </div>
            <SignupIndicators active={1} />
            <p className="mt-[100px] text-center text-[20px] text-brand-600 leading-[168.5%] font-bold">
              Confirm your email address
            </p>
            <p className="font-medium text-brand-600 mt-[40px]">
              To continue setting up your profile, please check your email inbox
              for a{" "}
              <b className="font-medium text-brand-1650">verification link</b>{" "}
              sent to{" "}
              <b className="font-medium text-brand-1650">
                {userInfo?.user?.email}
              </b>
            </p>

            <div className="relative md:absolute md:bottom-[62px] mt-[130px] pb-[50px] md:mt-[unset] w-full">
              <p className="text-[#94AEC5] text-[14px] font-medium leading-[21px] text-center">
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
                  className="text-[#003D72] underline cursor-pointer"
                >
                  Resend
                </b>{" "}
                in {seconds}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupBanner;
