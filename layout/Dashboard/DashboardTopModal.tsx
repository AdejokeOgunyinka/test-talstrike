/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import { useSession, signOut } from "next-auth/react";

import ProfileImg from "@/assets/profileIcon.svg";
import { useTypedSelector } from "@/hooks/hooks";
import { handleOnError } from "@/libs/utils";
import { useGetAchievements, useGetAppearances } from "@/api/profile";

const DashboardTopBarModal = () => {
  const { data: session } = useSession();
  const { userInfo } = useTypedSelector((state) => state.profile);

  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const { data: achievements } = useGetAchievements({
    token: TOKEN as string,
    userId: USER_ID as string,
  });

  const { data: appearances } = useGetAppearances({
    token: TOKEN as string,
    userId: USER_ID as string,
  });

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
        <img
          src={
            userInfo?.profile?.user?.image !== null
              ? userInfo?.profile?.user?.image
              : ProfileImg
          }
          alt="profile"
          className="profile-img object-cover w-full h-full rounded-[50%]"
          onError={handleOnError}
        />
      </div>
      <h3 className="font-medium text-brand-1800 text-[16px] leading-[24px]">
        {session?.user?.firstname} {session?.user?.lastname}
      </h3>
      <p className="text-brand-2000 text-[11px] font-normal mb-[17px]">
        {session?.user?.email}
      </p>
      <a
        href="/profile"
        className="w-[102px] flex justify-center items-center bg-brand-2050 rounded-[19px] h-[29px] text-brand-600 mb-[21px] text-[10px] font-semibold"
      >
        View Profile
      </a>
      <p className="text-brand-600 font-medium text-[11px] leading-[16px] mb-[11px]">
        {achievements?.pages?.flat(1)?.length} Achievement
        {achievements?.pages?.flat(1) &&
          achievements?.pages?.flat(1)?.length > 1 &&
          "s"}
      </p>
      <p className="text-brand-600 font-medium text-[11px] leading-[16px] mb-[11px]">
        {appearances?.results?.length} Appearance
        {appearances?.results?.length > 1 && "s"}
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
