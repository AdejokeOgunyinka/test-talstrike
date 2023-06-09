import SignupIndicators from "@/features/Auth/Signup/SignupIndicators";

const AuthSetupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={`relative w-full min-h-screen 2xl:w-[70vw] h-full 2xl:h-[85vh] bg-brand-500  2xl: mx-auto 2xl: my-auto 2xl:rounded-[29px] 2xl:overflow-hidden bg-plain bg-no-repeat bg-cover bg-center bg-fixed flex justify-center`}
    >
      <div className="w-[75%] h-full flex flex-col items-center">
        <h3 className="mt-[62px] mb-[31px] text-[24px] leading-[168.5%] text-brand-1650 font-semibold">
          Account Setup
        </h3>
        <div className="md:mx-[100px]">
          <SignupIndicators active={2} />
        </div>
        <div className="w-full h-full mb-[100px] md:mb-[168px]">{children}</div>
      </div>
    </div>
  );
};

export default AuthSetupLayout;
