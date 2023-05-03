/* eslint-disable @next/next/no-img-element */
const SignupIndicators = ({ active }: { active: number }) => {
  const indicators = ["Sign Up", "Confirm Email", "Set Up"];
  return (
    <div className="w-full">
      <div className="flex w-full gap-[16px] justify-between">
        {indicators?.map((indicator, index) => (
          <>
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
                className="w-[70px] md:w-[100%]"
              />
            )}
          </>
        ))}
      </div>
      <div className="flex w-full px-[unset] md:px-[10px] justify-between">
        {indicators?.map((indicator, index) => (
          <p
            style={{ color: active === index ? "#003D72" : "#94AEC5" }}
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
