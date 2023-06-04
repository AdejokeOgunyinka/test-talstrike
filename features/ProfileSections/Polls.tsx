/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import moment from "moment";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  HeartIcon as HeartIcon2,
} from "@heroicons/react/24/solid";
import BounceLoader from "react-spinners/BounceLoader";

import HeartIcon from "@/assets/heartIcon.svg";
import SkeletonLoader from "@/components/SkeletonLoader";
import {
  useCommentOnPoll,
  useGetAllCommentsOnPoll,
  useGetPollsByUserId,
  useVotePollChoice,
} from "@/api/profile";
import { useEffect, useState } from "react";
import PollRadioBtn from "@/components/PollRadioBtn";
import PollProgressBar from "@/components/PollProgressBar";
import CreatePoll from "@/components/ProfileModals/CreatePoll";
import notify from "@/libs/toast";
import { handleMediaPostError, handleOnError } from "@/libs/utils";
import { TextBox } from "@/components/ProfileModals/InputBox";
import { useCommentOnPost, useGetAllCommentsOnPost } from "@/api/dashboard";

const Image = styled.img``;

const MyPolls = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;
  const USER_IMG = session?.user?.image;
  const USER_NAME = `${session?.user?.firstname} ${session?.user?.lastname}`;

  const { data: userPolls, isLoading: isLoadingUserPosts } =
    useGetPollsByUserId({
      token: TOKEN as string,
      userId: USER_ID as string,
    });

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [pollIndex, setPollIndex] = useState("");

  const [chosenPost, setChosenPost] = useState<any>(null);

  const queryClient = useQueryClient();
  const { mutate: commentOnPoll, isLoading: isCommenting } = useCommentOnPoll();

  const { data: commentsOnPoll } = useGetAllCommentsOnPoll({
    token: TOKEN as string,
    pollId: pollIndex,
  });

  const [showSinglePoll, setShowSinglePoll] = useState(false);

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] h-[42px] py-[15px] px-[15px] flex flex-col gap-y-[7px]">
        <p
          onClick={() => {
            setShowSinglePoll(true);
            setShowPopover(false);
          }}
          className="text-brand-600 text-[10px] font-medium leading-[15px] cursor-pointer"
        >
          View Poll
        </p>

        {/* <p className="text-brand-2600 text-[10px] font-medium leading-[15px]">
          Delete Poll
        </p> */}
      </div>
    );
  };

  const [openCreatePollModal, setOpenCreatePollModal] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const [emptyComment, setEmptyComment] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  return (
    <div className="mt-[21px] w-full">
      {openCreatePollModal && (
        <CreatePoll onClose={() => setOpenCreatePollModal(false)} />
      )}
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          My Polls
        </h3>
        <button
          onClick={() => setOpenCreatePollModal(!openCreatePollModal)}
          className="bg-brand-600  w-[142px] h-[41px] rounded-[19px] font-semibold text-[12px] leading-[18px] text-brand-500"
        >
          Create Poll
        </button>
      </div>

      {showSinglePoll === true ? (
        <div className="w-full p-[24px] rounded-[4px]">
          <div className="w-full mb-[10px]">
            <ArrowLeftIcon
              className="w-[20px] h-[20px] cursor-pointer"
              onClick={() => setShowSinglePoll(false)}
            />
          </div>
          <div className="w-full bg-brand-500 divide-y divide-brand-1150">
            <div className="py-[27px] px-[33px]">
              <div className="flex justify-between items-center mb-[32px]">
                <div className="flex gap-x-[7px] items-center">
                  <img
                    src={USER_IMG ? (USER_IMG as string) : "/profileIcon.svg"}
                    alt="post image"
                    className="object-cover w-[40px] h-[40px] rounded-[50%] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                    onError={handleOnError}
                  />
                  <div>
                    <h4 className="text-brand-2250 font-semibold text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px]">
                      {USER_NAME}
                    </h4>
                    <h4 className="text-[#94AEC5] font-medium text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[15px]">
                      {moment(chosenPost?.created_at)?.format("ll")}
                    </h4>
                  </div>
                </div>
                <div className="text-brand-2250 font-semibold text-[27.7232px] flex items-center">
                  ...
                </div>
              </div>
            </div>
            <div className="w-full">
              {chosenPost?.image && (
                <Image
                  src={chosenPost?.image}
                  alt="post img"
                  onError={handleMediaPostError}
                  className="w-full object-cover"
                />
              )}
            </div>

            <div className="w-full">
              <div className="flex w-full justify-between py-[12px] md:py-[21px] px-[14px] md:px-[23px]">
                <div className="flex flex-col cursor-pointer items-center">
                  <div className="mb-[5px] gap-x-[5px] flex items-center">
                    <div>
                      {chosenPost?.liked?.status === true ? (
                        <HeartIcon2 className="h-[20px] w-[20px] text-brand-love" />
                      ) : (
                        <NextImage src={HeartIcon} alt="heart" />
                      )}
                    </div>
                    <p
                      className={
                        "font-medium text-[13px] " +
                        `${
                          chosenPost?.liked?.status === true
                            ? "text-brand-love"
                            : "text-brand-2550"
                        }`
                      }
                    >
                      {chosenPost?.like_count}{" "}
                    </p>
                    <p
                      className={
                        "text-[9px] font-medium leading-[14px] " +
                        `${
                          chosenPost?.liked?.status === true
                            ? "text-brand-love"
                            : "text-brand-2550"
                        }`
                      }
                    >
                      Like{chosenPost?.like_count > 1 && "s"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="flex gap-x-[3px] mb-[5px] items-center">
                    <NextImage
                      src="/chatbox2.svg"
                      width="15"
                      height="15"
                      alt="chatbox"
                    />
                    <p className="text-brand-2250 font-medium text-[13px]">
                      {chosenPost?.comment_count}
                    </p>
                    <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                      Comments
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center cursor-pointer">
                  <div className="flex gap-x-[3px] mb-[5px] items-center">
                    <NextImage
                      className="cursor-pointer"
                      src="/arrow2.svg"
                      width="15"
                      height="15"
                      alt="arrow"
                    />
                    <p className="text-brand-2250 font-medium text-[13px]">
                      {chosenPost?.share_count}
                    </p>
                    <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                      Shares
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full py-[27px] px-[33px]">
              <h4 className="mt-[14px] mb-[13px] font-semibold text-[#343D45] text-[16px] lg:text-[22px] ">
                {chosenPost?.question_text}
              </h4>

              <div className="flex flex-wrap gap-x-[20px] mb-[25px]">
                {chosenPost?.poll_choices?.map((choice: any, index: number) => (
                  <p
                    key={index}
                    className="text-[#94AEC5] font-semibold text-[14px]"
                  >
                    {choice?.choice_text} - {choice?.percentage}%
                  </p>
                ))}
              </div>

              {chosenPost?.voted ? (
                <InactivePoll options={chosenPost?.poll_choices} />
              ) : (
                <ActivePoll
                  options={chosenPost?.poll_choices}
                  token={TOKEN as string}
                  pollId={chosenPost?.id}
                />
              )}
            </div>

            <div className="w-full py-[49px] px-[29px]">
              <div className="w-full flex gap-x-[28px]">
                <img
                  src={USER_IMG ? (USER_IMG as string) : "/profileIcon.svg"}
                  alt="post image"
                  className="object-cover w-[40px] h-[40px] rounded-[50%] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                  onError={handleOnError}
                />
                <div className="w-full">
                  <TextBox
                    id="comment"
                    placeholder="What are you thoughts about this post?"
                    className="-mt-[0.5px]"
                    onChange={(e: any) => setInputComment(e?.target?.value)}
                    value={inputComment}
                  />
                  {emptyComment && (
                    <p className="text-[11px] text-warning">
                      Please write a comment before you hit send
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-end mt-[15px]">
                <button
                  onClick={() => {
                    setEmptyComment(false);
                    if (!inputComment) {
                      setEmptyComment(true);
                    } else {
                      inputComment &&
                        commentOnPoll(
                          {
                            pollId: chosenPost?.id,
                            body: { comment: inputComment },
                            token: TOKEN as string,
                          },
                          {
                            onSuccess: () => {
                              setInputComment("");
                              queryClient.invalidateQueries([
                                "getAllCommentsOnPoll",
                              ]);
                            },
                          }
                        );
                    }
                  }}
                  className="w-[115px] h-[36px] border-[1.5px] border-brand-2250 text-[14px] text-brand-2250 rounded-[2px]"
                >
                  {isCommenting ? (
                    <BounceLoader
                      color={"blue"}
                      size={10}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    "Comment"
                  )}
                </button>
              </div>
            </div>
            {commentsOnPoll?.results?.length === 0 ? (
              <div className="w-full py-[42px] px-[36px]">
                <p>No comments on this post yet...</p>
              </div>
            ) : (
              <div className="w-full py-[42px] px-[36px] flex flex-col gap-y-[36px]">
                {commentsOnPoll?.results?.map((comment: any, index: number) => (
                  <div className="flex items-center" key={index}>
                    <img
                      src={
                        comment?.author?.image !== null
                          ? comment?.author?.image
                          : "/profileIcon.svg"
                      }
                      alt="author"
                      className="object-cover w-[40px] h-[40px] rounded-[50%] border-[2.5px] border-brand-500"
                      onError={handleOnError}
                    />
                    <div className="pl-[16px]">
                      <p className="text-[14px] text-brand-2250 font-semibold leading-[21px]">
                        {comment?.author?.firstname} {comment?.author?.lastname}
                      </p>
                      <p className="text-[14px] mt-[9px] text-[#343D45] leading-[179.5%]">
                        {comment?.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
                        src={USER_IMG as string}
                        alt="post creator"
                        width="39"
                        height="39"
                        className="mr-[7px] object-cover rounded-[100%] w-[39px] h-[39px] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                        onError={handleOnError}
                      />
                    </div>

                    <div>
                      <p className="mb-[3px] font-semibold text-[11px] leading-[16px] text-brand-2250">
                        {USER_NAME}
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
                        setPollIndex(post?.id);
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
                  {post?.voted ? (
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
                    <b className="font-semibold">
                      {"  "} {post?.duration?.split(" ")[1]?.split(":")[0]}
                    </b>{" "}
                    hours
                    <b className="font-semibold">
                      {"  "} {post?.duration?.split(" ")[1]?.split(":")[1]}
                    </b>{" "}
                    mins
                  </div>
                  <div>
                    {index + 1 === 1
                      ? "Ongoing"
                      : index + 1 === 2
                      ? "Final result"
                      : "Ongoing"}
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

export const ActivePoll = ({
  options,
  token,
  pollId,
}: {
  options: any;
  token: string;
  pollId: string;
}) => {
  const [selected, setSelected] = useState("");
  const [chosenId, setChosenId] = useState("");

  const { mutate: votePoll } = useVotePollChoice();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (chosenId) {
      votePoll(
        {
          data: { voter_choice: chosenId },
          pollId: pollId,
          token: token,
        },
        {
          onSuccess() {
            notify({ type: "success", text: "Your vote was successful" });
            queryClient.invalidateQueries(["getPollsByUserId"]);
            setChosenId("");
          },
        }
      );
    }
  }, [chosenId]);

  return (
    <div className="flex flex-col gap-y-[14px] w-full">
      {options?.map((option: any, index: number) => (
        <PollRadioBtn
          name={option?.choice_text}
          value={option?.choice_text}
          key={index}
          selected={selected}
          onChange={() => {
            setSelected(option?.choice_text);
            setChosenId(option?.choice_id);
          }}
        />
      ))}
    </div>
  );
};

export const InactivePoll = ({ options }: { options: any }) => {
  const getHighest = () => {
    const values = options?.map((option: any) => parseInt(option?.percentage));
    const highest = Math.max(...values);
    return options?.findIndex(
      (option: any) => parseInt(option?.percentage) == highest
    );
  };

  return (
    <div className="flex flex-col w-full gap-y-[14px]">
      {options?.map((option: any, index: number) => (
        <PollProgressBar
          bgColor="bg-[#D7EAFB]"
          key={index}
          completed={option?.percentage}
          option={option?.choice_text}
          special={index === getHighest()}
        />
      ))}
    </div>
  );
};

export default MyPolls;
