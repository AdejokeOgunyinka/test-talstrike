/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/layout/Dashboard";
import { handleOnError } from "@/libs/utils";
import { useState } from "react";

const Index = () => {
  const { data: session } = useSession();
  const USER_IMG = session?.user?.image;
  const [chosenVideoId, setChosenVideoId] = useState<any>("");
  const [play, setPlay] = useState(false);

  let vid = document.getElementById(`explore-video-${chosenVideoId}`);

  function playVid() {
    vid?.play();
  }

  function pauseVid() {
    vid?.pause();
  }

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px] px-[15px] lg:px-[31px]">
        <div className="w-[90%] mt-[23px] flex flex-wrap gap-[12px] pb-[100px] lg:pb-0">
          {[1, 1, 1, 1, 1]?.map((_, index) => (
            <div key={index} className="relative w-[100%] md:w-[47%] h-[464px]">
              <video
                id={`explore-video-${index}`}
                src="/talstrikeSportVideo.mp4"
                className="w-full h-full object-cover rounded-[4px]"
              />
              <div className="absolute w-full bottom-0 px-[23px] pb-[30px]">
                <div className="relative flex h-full text-brand-500 pb-[80px]">
                  <div className="absolute h-full bottom-0 pr-[70px]">
                    <p className="text-[14px]">
                      typesetting industry. Lorem Ipsum is simply dummy text of
                      the printing the
                      <b className="font-medium ml-[3px]">See more</b>
                    </p>
                  </div>

                  <div className="absolute right-0 bottom-0 pb-[25px]">
                    <img
                      src="/arrow-redo.svg"
                      alt="arrow-redo"
                      className="mb-[2px]"
                    />
                    <p className="mb-[21px]">26</p>

                    <img src="/played.svg" alt="played" className="mb-[2px]" />
                    <p className="mb-[21px]">26</p>

                    <img
                      src="/chatbox3.svg"
                      alt="chatbox3"
                      className="mb-[2px]"
                    />
                    <p className="mb-[21px]">26</p>

                    <img src="/heart2.svg" alt="heart2" className="mb-[2px]" />
                    <p className="mb-[21px]">26</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex">
                    <img
                      src={USER_IMG as string}
                      alt="profile image"
                      className="object-cover w-[48px] h-[48px] rounded-[50%] border-[2px] border-[#fff] mr-[9px]"
                      onError={handleOnError}
                    />
                    <div className="text-brand-500">
                      <p className="mb-[5px] font-semibold">Mercy Riche</p>
                      <p className="text-[12px] font-normal">
                        Tuesday 12 October
                      </p>
                    </div>
                  </div>
                  <button className="border border-brand-500 px-[25px] rounded-[4px] text-brand-500">
                    Follow
                  </button>
                </div>
              </div>

              <div className="absolute w-full bottom-0 h-full flex justify-center items-center">
                <img
                  src={"/playIcon2.svg"}
                  alt="playIcon 2"
                  className="cursor-pointer"
                  onClick={() => {
                    index === parseInt(chosenVideoId)
                      ? setChosenVideoId("")
                      : setChosenVideoId(index);

                    if (play && index === chosenVideoId) {
                      pauseVid();
                    } else {
                      playVid();
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
