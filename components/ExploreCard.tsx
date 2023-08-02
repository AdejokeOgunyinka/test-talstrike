/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";

import { handleMediaPostError, handleOnError } from "@/libs/utils";
import { useFollowUser } from "@/api/players";
import notify from "@/libs/toast";
import ModalContainer from "./Modal";
import SinglePost from "./SingleProfilePostComponent/SinglePost";

const ExploreCard = ({ index, post }: { index: number; post: any }) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const queryClient = useQueryClient();

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  // const [stop, setStop] = useState(false);

  // const handleVideo = () => {
  //   setStop(!stop);
  //   if (stop === true) {
  //     videoRef?.current?.pause();
  //   } else {
  //     videoRef?.current?.play();
  //   }
  // };

  const [showFullPostText, setShowFullPostText] = useState(false);
  const { mutate: followUser, isLoading: isFollowingPlayer } = useFollowUser();

  const [showMoreAboutVideo, setShowMoreAboutVideo] = useState(false);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showMoreAboutVideo) {
    setInterval(incrementSeconds, 1000);
  }

  return (
    <>
      {showMoreAboutVideo && (
        <ModalContainer marginTop="md:mt-[0px]">
          <div className="w-[750px] h-screen overflow-scroll bg-brand-500">
            <SinglePost
              chosenPost={post}
              setShowSinglePost={setShowMoreAboutVideo}
              seconds={seconds}
            />
          </div>
        </ModalContainer>
      )}
      <div className="relative w-[100%] xl:w-[47%] h-[464px]">
        <video
          ref={videoRef}
          id={`explore-video-${index}`}
          src={post?.media}
          className="w-full h-full object-cover md:rounded-[4px] bg-brand-100"
          onError={handleMediaPostError}
        />

        <div className="absolute w-full  bottom-0 h-full px-[23px] pb-[70px]">
          <div className="relative flex h-full text-brand-500 pb-[80px]">
            <div className="absolute pb-[21px] bottom-0 pr-[70px]">
              <p className="text-[14px] cursor-pointer">
                {showFullPostText
                  ? post?.body
                  : `${post?.body?.slice(0, 100)}${
                      post?.body?.length > 100 ? "..." : ""
                    }`}
                {post?.body?.length > 100 && (
                  <b
                    className="font-medium ml-[3px]"
                    onClick={() =>
                      showFullPostText
                        ? setShowFullPostText(false)
                        : setShowFullPostText(true)
                    }
                  >
                    {showFullPostText ? "...Show Less" : "See More"}
                  </b>
                )}
              </p>
            </div>

            <div className="absolute right-0 bottom-0 pb-[25px] text-[17px] flex flex-col items-center">
              <img
                src="/arrow-redo.svg"
                alt="arrow-redo"
                className="mb-[2px]"
              />
              <p className="mb-[21px]">{post?.share_count}</p>

              <img src="/played.svg" alt="played" className="mb-[2px]" />
              <p className="mb-[21px]">{post?.view_count}</p>

              <img src="/chatbox3.svg" alt="chatbox3" className="mb-[2px]" />
              <p className="mb-[21px]">{post?.comment_count}</p>

              <img src="/heart2.svg" alt="heart2" className="mb-[2px]" />
              <p className="mb-[21px]">{post?.like_count}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex">
              <img
                src={post?.author?.image as string}
                alt="profile image"
                className="object-cover w-[48px] h-[48px] rounded-[50%] border-[2px] border-[#fff] mr-[9px]"
                onError={handleOnError}
              />
              <div className="text-brand-500">
                <p className="mb-[5px] font-semibold text-[14px]">
                  {post?.author?.firstname} {post?.author?.lastname}
                </p>
                <p className="text-[12px] font-normal">
                  {moment(post?.created_at)?.format("dddd Do MMM YYYY")}
                </p>
              </div>
            </div>
            {post?.is_following !== true && (
              <button
                onClick={() => {
                  followUser(
                    {
                      token: TOKEN as string,
                      userId: post?.author?.id,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries(["getSuggestedFollows"]);
                        notify({
                          type: "success",
                          text: `You are now following ${post?.author?.firstname} ${post?.author?.lastname}`,
                        });
                      },
                    }
                  );
                }}
                className="border border-brand-500 text-[14px]  rounded-[4px] text-brand-500 h-[32px] w-[78px]"
              >
                {isFollowingPlayer ? (
                  <BeatLoader
                    color={"orange"}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Follow"
                )}
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-[50%] left-[50%] flex justify-center items-center">
          <img
            src={"/playIcon2.svg"}
            alt="playIcon 2"
            className="cursor-pointer z-[999]"
            onClick={() => setShowMoreAboutVideo(true)}
          />
        </div>
      </div>
    </>
  );
};

export default ExploreCard;
