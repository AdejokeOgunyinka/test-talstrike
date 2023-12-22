import NextImage from "next/image";
import TalstrikeLogo from "@/assets/TalstrikeLogo.svg";

type AuthSelectionLayoutProps = {
  children?: React.ReactNode;
  withBgImg?: boolean;
  bgImg?: any;
};

const AuthSelectionLayout = ({
  children,
  withBgImg,
  bgImg,
}: AuthSelectionLayoutProps) => {
  return (
    <div className="w-full min-h-screen lg:flex lg:justify-center">
      <div
        className={`relative w-full min-h-screen h-full  bg-brand-500 ${
          withBgImg === true ? bgImg : "md:bg-plain"
        } bg-no-repeat bg-cover bg-center bg-fixed`}
      >
        <div className="w-full absolute top-[41px] lg:pl-[100px] text-center lg:text-start">
          <NextImage src={TalstrikeLogo} alt="logo" />
        </div>
        <div className="w-full h-full">{children}</div>
        <div className="relative lg:absolute lg:bottom-[32px] text-center lg:text-start lg:right-[97px]">
          <p className="text-brand-900 font-medium text-[11px]">
            © {new Date()?.getFullYear()} Talstrike Technologies. All Rights
            Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSelectionLayout;
