import AuthSlideShow from "./AuthSlideshow";

type AuthLayoutProps = {
  children?: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="w-full h-screen lg:flex lg:justify-center">
      <div className="w-full h-screen flex">
        <div className="basis-1/2 h-full w-full hidden lg:inline-block">
          <AuthSlideShow />
        </div>
        <div className="basis-full flex lg:inline-block justify-center lg:justify-start lg:basis-1/2 h-full w-full bg-brand-500">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
