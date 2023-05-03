import NextImage from "next/image";
import TalstrikeLogo from "@/assets/TalstrikeLogo.svg";

const PageLoader = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <NextImage src={TalstrikeLogo} alt="logo" width="268" height="104" />

      <div className="mt-[46px] w-[237px] h-[5px] rounded-[100px] ">
        <div className="progress-bar">
          <div className="progress-bar-value"></div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
