import SignupIndicators from "@/features/Auth/Signup/SignupIndicators";

const AuthSetupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={`relative w-full min-h-screen h-full bg-brand-500  bg-plain bg-no-repeat bg-cover bg-center bg-fixed flex justify-center`}
    >
      <div className="w-[75%] h-full flex flex-col items-center">
        <div className="mt-[62px] md:mx-[100px]">
          <SignupIndicators active={2} />
        </div>
        <h3 className="mt-[28px] mb-[20px] text-[30px] leading-[168.5%] text-brand-600 font-semibold">
          Account Setup
        </h3>
        <div className="w-full h-full mb-[100px] md:mb-[168px]">{children}</div>
      </div>
    </div>
  );
};

export default AuthSetupLayout;
