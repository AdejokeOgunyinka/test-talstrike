/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import styled from "styled-components";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetMyProfile, useGetPollsByUserId } from "@/api/profile";
import { handleOnError } from "@/libs/utils";
import { ActivePoll, InactivePoll } from "../ProfileSections/Polls";
import SinglePoll from "@/components/SingleProfilePostComponent/SinglePoll";

const Image = styled.img``;

const MyPolls = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();
  const { id } = router.query;

  const [page, setPage] = useState(1);
  const { data: userPolls, isLoading: isLoadingUserPosts } =
    useGetPollsByUserId({
      token: TOKEN as string,
      userId: id as string,
      page: page,
    });

  const { data: userProfile } = useGetMyProfile({
    token: TOKEN as string,
    userId: id as string,
  });

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [chosenPost, setChosenPost] = useState<any>(null);
  const [showSinglePoll, setShowSinglePoll] = useState(false);

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] py-[10px] px-[15px] flex flex-col gap-y-[7px]">
        <p
          onClick={() => {
            setShowSinglePoll(true);
            setShowPopover(false);
          }}
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
        >
          View Poll
        </p>
      </div>
    );
  };

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSinglePoll) {
    setInterval(incrementSeconds, 1000);
  }

  return (
    <div className="mt-[21px] w-full">
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          {`${userProfile?.user?.firstname}'s`} Polls
        </h3>
      </div>

      {showSinglePoll === true ? (
        <SinglePoll
          setShowSinglePoll={setShowSinglePoll}
          seconds={seconds}
          chosenPost={chosenPost}
        />
      ) : (
        <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
          {isLoadingUserPosts ? (
            <SkeletonLoader />
          ) : userPolls?.results?.length === 0 || !userPolls?.results ? (
            <p>No poll available at the moment...</p>
          ) : (
            userPolls?.results?.map((post: any, index: number) => (
              <div
                key={index}
                className="rounded-[8px] bg-brand-500 shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] basis-[100%] md:basis-[48%] pt-[21px] px-[23px] w-full md:w-[45%]"
              >
                <div className="flex items-center justify-between mb-[35px]">
                  <div className="flex items-center">
                    <div className="mr-[7px] rounded-[100%] w-[39px] h-[39px] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]">
                      <NextImage
                        src={post?.author?.image as string}
                        alt="post creator"
                        width="39"
                        height="39"
                        className="mr-[7px] object-cover rounded-[100%] w-[39px] h-[39px] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                        onError={handleOnError}
                      />
                    </div>

                    <div>
                      <p className="mb-[3px] font-semibold text-[11px] leading-[16px] text-brand-2250">
                        {post?.author?.firstname} {post?.author?.lastname}
                      </p>
                      <p className="font-medium text-[10px] leading-[15px] text-brand-2450">
                        {moment(post?.created_at).format("dddd Do MMMM")}
                      </p>
                    </div>
                  </div>
                  <div
                    className="cursor-pointer relative"
                    onClick={(e) => e?.stopPropagation()}
                  >
                    <p
                      className="text-brand-2250 text-[27.7px] leading-[0px] pb-[10px] font-semibold"
                      onClick={() => {
                        setClickedIndex(index);
                        setChosenPost(post);
                        setShowPopover(!showPopover);
                      }}
                    >
                      ...
                    </p>
                    {showPopover && clickedIndex === index && <Popover />}
                  </div>
                </div>

                <p className="text-brand-1750 mb-[9px] text-[14px] font-semibold leading-[21px]">
                  {post?.question_text}
                </p>

                <div className="w-full flex justify-center">
                  {post?.image && <Image src={post?.image} alt="poll img" />}
                </div>

                <div className="relative mb-[33px] rounded-[4px] overflow-hidden w-[full] mt-[20px]">
                  {post?.voted ||
                  post?.author?.id === session?.user?.id ||
                  moment(
                    moment(new Date(post?.created_at)).add(
                      parseInt(post?.duration?.split(" ")[0]),
                      "days"
                    )
                  ).diff(new Date(), "days") < 1 ? (
                    <InactivePoll options={post?.poll_choices} />
                  ) : (
                    <ActivePoll
                      options={post?.poll_choices}
                      token={TOKEN as string}
                      pollId={post?.id}
                    />
                  )}
                </div>

                <div className="flex mb-[12px] justify-between w-full text-[14px] text-brand-2250">
                  <div>
                    <b className="font-semibold">{post?.total_vote_count}</b>{" "}
                    vote
                    {post?.total_vote_count > 1 && "s"}
                  </div>
                  <div className="border border-t-transparent border-b-transparent border-l-brand-2750 border-r-brand-2750 px-[40px]">
                    {parseInt(post?.duration?.split(" ")[0]) > 0 && (
                      <>
                        <b className="font-semibold">
                          {post?.duration?.split(" ")[0]}
                        </b>{" "}
                        days
                      </>
                    )}
                  </div>
                  <div>
                    {moment(
                      moment(new Date(post?.created_at)).add(
                        parseInt(post?.duration?.split(" ")[0]),
                        "days"
                      )
                    ).diff(new Date(), "days") > 0 &&
                    moment(
                      moment(new Date(post?.created_at)).add(
                        parseInt(post?.duration?.split(" ")[0]),
                        "days"
                      )
                    ).diff(new Date(), "days") < 2
                      ? "Ongoing"
                      : moment(
                          moment(new Date(post?.created_at)).add(
                            parseInt(post?.duration?.split(" ")[0]),
                            "days"
                          )
                        ).diff(new Date(), "days") > 2
                      ? moment(
                          moment(new Date(post?.created_at)).add(
                            parseInt(post?.duration?.split(" ")[0]),
                            "days"
                          )
                        ).diff(new Date(), "days") + " days remaining"
                      : "Final result"}
                  </div>
                </div>

                <div className="h-[78px] px-[19px] border -mx-[22px] border-b-0 border-x-0 border-t-1 border-brand-2500 flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-x-[3px] mb-[5px]">
                      <NextImage
                        src="/heart.svg"
                        width="15"
                        height="15"
                        alt="heart"
                      />
                      <p className="text-brand-2250 font-medium text-[13px]">
                        {post?.like_count}
                      </p>
                    </div>
                    <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                      Like{post?.like_count > 1 && "s"}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex gap-x-[3px] mb-[5px]">
                      <NextImage
                        src="/chatbox2.svg"
                        width="15"
                        height="15"
                        alt="chatbox"
                      />
                      <p className="text-brand-2250 font-medium text-[13px]">
                        {post?.comment_count}
                      </p>
                    </div>
                    <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                      Comments
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex gap-x-[3px] mb-[5px]">
                      <NextImage
                        src="/arrow2.svg"
                        width="15"
                        height="15"
                        alt="arrow"
                      />
                      <p className="text-brand-2250 font-medium text-[13px]">
                        {post?.share_count}
                      </p>
                    </div>
                    <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                      Shares
                    </p>
                  </div>
                  {/* <div className="flex flex-col items-center">
                  <div className="flex gap-x-[3px] mb-[5px]">
                    <NextImage src="/barChart.svg" width="15px" height="15px" />
                    <p className="text-brand-2250 font-medium text-[13px]">26</p>
                  </div>
                  <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">Views</p>
                </div> */}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isLoadingUserPosts &&
        userPolls?.results?.length > 0 &&
        !showSinglePoll && (
          <div className="flex justify-between items-center w-full mt-[20px]">
            <div>
              {userPolls?.current_page > 1 && (
                <ArrowLeftCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    if (page === 1) {
                      setPage(1);
                    } else {
                      setPage(page - 1);
                    }
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
            <div className="flex gap-[20px] items-center">
              <div className="border border-brand-600 w-[55px] rounded-[5px] flex justify-end pr-[10px]">
                {page}
              </div>
              {userPolls?.current_page < userPolls?.total_pages && (
                <ArrowRightCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        )}

      {/* {!isLoadingUserPosts &&
        userPolls?.results &&
        userPolls?.results?.length !== 0 && (
          <div className="mt-[45px] w-full flex justify-center items-center">
            <button className="w-[146px] bg-brand-600 h-[41px] rounded-[19px] text-brand-500 text-[14px] leading-[21px]">
              Load More
            </button>
          </div>
        )} */}
    </div>
  );
};

export default MyPolls;
