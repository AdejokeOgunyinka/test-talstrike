import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { handleOnError } from "@/libs/utils";

/* eslint-disable @next/next/no-img-element */
const ExploreCard = () => {
  const { data: session } = useSession();
  const USER_IMG = session?.user?.image;

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stop, setStop] = useState(false);

  const handleVideo = () => {
    setStop(!stop);
    if (stop === true) {
      videoRef?.current?.pause();
    } else {
      videoRef?.current?.play();
    }
  };

  return (
    <div className="relative w-[100%] md:w-[47%] h-[464px]">
      <video
        ref={videoRef}
        src="/talstrikeSportVideo.mp4"
        className="w-full h-full object-cover rounded-[4px]"
      />

      <div className="absolute w-full bottom-0 px-[23px] pb-[30px]">
        <div className="relative flex h-full text-brand-500 pb-[80px]">
          <div className="absolute h-full bottom-0 pr-[70px]">
            <p className="text-[14px]">
              typesetting industry. Lorem Ipsum is simply dummy text of the
              printing the
              <b className="font-medium ml-[3px]">See more</b>
            </p>
          </div>

          <div className="absolute right-0 bottom-0 pb-[25px] text-[17px]">
            <img src="/arrow-redo.svg" alt="arrow-redo" className="mb-[2px]" />
            <p className="mb-[21px]">26</p>

            <img src="/played.svg" alt="played" className="mb-[2px]" />
            <p className="mb-[21px]">26</p>

            <img src="/chatbox3.svg" alt="chatbox3" className="mb-[2px]" />
            <p className="mb-[21px]">26</p>

            <img src="/heart2.svg" alt="heart2" className="mb-[2px]" />
            <p className="mb-[21px]">26</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex">
            <img
              src={USER_IMG as string}
              alt="profile image"
              className="object-cover w-[48px] h-[48px] rounded-[50%] border-[2px] border-[#fff] mr-[9px]"
              onError={handleOnError}
            />
            <div className="text-brand-500">
              <p className="mb-[5px] font-semibold text-[14px]">Mercy Riche</p>
              <p className="text-[12px] font-normal">Tuesday 12 October</p>
            </div>
          </div>
          <button className="border border-brand-500 text-[14px]  rounded-[4px] text-brand-500 h-[32px] w-[78px]">
            Follow
          </button>
        </div>
      </div>

      <div className="absolute w-full bottom-0 h-full flex justify-center items-center">
        <img
          src={"/playIcon2.svg"}
          alt="playIcon 2"
          className="cursor-pointer"
          onClick={handleVideo}
        />
      </div>
    </div>
  );
};

export default ExploreCard;
