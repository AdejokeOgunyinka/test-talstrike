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

  let vid: any = document.getElementById(`explore-video-${chosenVideoId}`);

  function playVid() {
    vid?.play();
  }

  function pauseVid() {
    vid?.pause();
  }

  const exploreSections = [
    { title: "For you" },
    { title: "Trends" },
    { title: "Top" },
    { title: "Latest" },
    { title: "Live" },
  ];

  const [currentSection, setCurrentSection] = useState(1);

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col justify-center md:rounded-tl-[15px] md:rounded-tr-[15px] min-h-[100vh] bg-brand-1000 py-[28px]">
        <div className="flex z-[99] pl-[30px] flex-wrap lg:flex-nowrap gap-y-[10px] w-full lg:w-[calc(100%-450px)] lg:-mt-[30px] backdrop-blur-[15px] pt-[29px] lg:fixed lg: top-[99px] gap-x-[20px] lg:gap-x-[54px] mr-[31px] bg-brand-profile-header border-t-0 border-[3px] border-x-0 lg:border-b-brand-300">
          {exploreSections?.map((section, index) => (
            <div
              key={index}
              onClick={() => setCurrentSection(index + 1)}
              className={`border-t-0 border-[3px] border-x-0 z-[22] -mb-[3px] lg:-mb-[3px] ${
                currentSection === index + 1
                  ? "border-b-brand-2250"
                  : "border-b-brand-300"
              } cursor-pointer`}
            >
              <h3
                className={`${
                  currentSection === index + 1
                    ? "text-brand-2250"
                    : "text-brand-2200"
                } mb-[11px] text-[11px] lg:text-[14px] font-semibold`}
              >
                {section.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="w-[100%] px-[31px] mt-[53px] flex flex-wrap gap-[12px] pb-[100px] lg:pb-0">
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
