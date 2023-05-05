import React from "react";

/* eslint-disable @next/next/no-img-element */
const SignupIndicators = ({ active }: { active: number }) => {
  const indicators = ["Sign Up", "Confirm Email", "Set Up"];
  return (
    <div className="w-full">
      <div className="flex w-full gap-[16px] justify-between">
        {indicators?.map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex w-full flex-col gap-[16px] items-center">
              <div
                className="flex justify-center items-center w-[36.14px] h-[36.14px] rounded-[50%]"
                style={{
                  background:
                    active > index
                      ? "#003D72"
                      : active === index
                      ? "#ff"
                      : "#E3E2E2",
                  border: `1.5057px solid ${
                    active > index
                      ? "#003D72"
                      : active === index
                      ? "#003D72"
                      : "#E3E2E2"
                  }`,
                  color:
                    active > index
                      ? "#fff"
                      : active === index
                      ? "#003D72"
                      : "#94AEC5",
                }}
              >
                {index + 1}
              </div>
            </div>

            {index !== indicators.length - 1 && (
              <img
                src={
                  active > index
                    ? "/coloredSignupIndicator.svg"
                    : "/signupIndicator.svg"
                }
                alt="indicator"
                className={`${
                  active === 2 ? "w-[50px] md:w-[100%]" : "w-[70px] md:w-[100%]"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div
        className={`flex w-full mt-[10px] md:mt-[16px] ${
          active === 2
            ? "px-[0px]  md:px-[30px] lg:px-[0px]"
            : "px-[unset] md:px-[10px] lg:px-[15px]"
        } justify-between`}
      >
        {indicators?.map((indicator, index) => (
          <p
            style={{
              color: active === index || active > index ? "#003D72" : "#94AEC5",
            }}
            key={index}
            className="text-[14px] leading-[21px] font-medium"
          >
            {indicator}
          </p>
        ))}
      </div>
    </div>
  );
};

export const SetupIndicator = ({
  active,
  isExperience,
}: {
  active: number;
  isExperience?: boolean;
}) => {
  const indicators = isExperience
    ? ["Experience", "Skill", "Interest", "Goal"]
    : ["Date of Birth", "Gender", "Phone Number", "Location"];

  return (
    <div className="w-full hidden md:inline-flex flex flex-col items-center">
      <div
        className={`flex w-[full] ${
          isExperience ? "md:w-[80%]" : "md:w-[93%]"
        } gap-[16px] justify-between mb-[10px]`}
      >
        {indicators?.map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className="flex justify-center items-center w-[16.7px] h-[16.7px] rounded-[50%]"
                style={{
                  background:
                    active - 1 > index
                      ? "#00B127"
                      : active - 1 === index
                      ? "#00B127"
                      : "#fff",
                  border: `1.5057px solid ${
                    active - 1 > index
                      ? "#00B127"
                      : active - 1 === index
                      ? "#ACE3B9"
                      : "#94AEC5"
                  }`,
                  color:
                    active - 1 > index
                      ? "#fff"
                      : active - 1 === index
                      ? "#003D72"
                      : "#94AEC5",
                }}
              ></div>
            </div>

            {index !== indicators.length - 1 && (
              <img
                src={
                  active - 1 > index
                    ? "/greenLineIndicator.svg"
                    : "/signupIndicator.svg"
                }
                alt="indicator"
                className={`${
                  active === 2 ? "w-[50px] md:w-[100%]" : "w-[70px] md:w-[100%]"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div
        className={`flex px-[unset] md:px-[10px] ${
          isExperience
            ? "w-[98%] lg:pl-[45px] lg:pr-[70px]"
            : "w-full lg:px-[0px]"
        }  justify-between`}
      >
        {indicators?.map((indicator, index) => (
          <p
            style={{
              color:
                active - 1 === index || active - 1 > index
                  ? "#00B127"
                  : "#94AEC5",
            }}
            key={index}
            className="text-[14px] leading-[21px] font-medium"
          >
            {indicator}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SignupIndicators;
