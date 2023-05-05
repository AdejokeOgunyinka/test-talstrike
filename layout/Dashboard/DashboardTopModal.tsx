import NextImage from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import ProfileImg from "@/assets/profileIcon.svg";
import { useTypedSelector } from "@/hooks/hooks";

const DashboardTopBarModal = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { userInfo } = useTypedSelector((state) => state.profile);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="absolute right-[2px] z-[99999] flex flex-col items-center pt-[15.34px] bg-brand-whitish backdrop-blur-[7.5px] rounded-[5px] h-[328px] w-[199px] top-[45px] border-[0.5px] border-brand-1950 shadow shadow-[2px_19px_27px_rgba(0, 0, 0, 0.1)]">
      <div className="w-[100%] relative">
        <div className="absolute mx-auto h-0 w-0 border-x-[5px] border-b-[10px] -top-[26px] right-[10px] border-solid border-r-transparent border-l-transparent border-b-brand-1950">
          <div className="absolute -right-[4.5px] -bottom-[10.5px] h-0 w-0 border-x-[4.5px] border-b-[9px] border-solid border-r-transparent border-l-transparent border-b-brand-whitish"></div>
        </div>
      </div>
      <div className="w-[64.75px] h-[64.75px] mb-[11.25px] border-4 border-brand-500 rounded-[50%] overflow-hidden shadow shadow-[0px_1.6087px_4.02174px_1.18265px_rgba(0, 0, 0, 0.07)]">
        <NextImage
          src={
            userInfo?.profile?.user?.image !== null
              ? userInfo?.profile?.user?.image
              : ProfileImg
          }
          width="161"
          height="161"
          alt="profile"
          className="profile-img"
        />
      </div>
      <h3 className="font-medium text-brand-1800 text-[16px] leading-[24px]">
        {session?.user?.firstname} {session?.user?.lastname}
      </h3>
      <p className="text-brand-2000 text-[11px] font-normal mb-[17px]">
        {session?.user?.email}
      </p>
      <button
        onClick={() => router.push("/profile")}
        className="w-[102px] bg-brand-2050 rounded-[19px] h-[29px] text-brand-600 mb-[21px] text-[10px] font-semibold"
      >
        View Profile
      </button>
      <p className="text-brand-600 font-medium text-[11px] leading-[16px] mb-[11px]">
        Achievements
      </p>
      <p className="text-brand-600 font-medium text-[11px] leading-[16px] mb-[11px]">
        Appearances
      </p>
      <div className="w-[100%] h-[75px] border-t-[0.5px] border-brand-2100 flex items-center justify-center gap-x-[20px]">
        <p className="text-[10px] text-brand-1800 cursor-pointer font-semibold">
          Settings
        </p>
        <p className="text-[10px] text-brand-1800 cursor-pointer font-semibold">
          Help
        </p>
        <p
          onClick={handleSignOut}
          className="text-[10px] cursor-pointer text-brand-1800 font-semibold"
        >
          Sign out
        </p>
      </div>
    </div>
  );
};

export default DashboardTopBarModal;
