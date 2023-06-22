/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BeatLoader, BounceLoader } from "react-spinners";
import { HeartIcon as HeartIcon2 } from "@heroicons/react/24/solid";
import moment from "moment";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import GifPicker from "gif-picker-react";
import EmojiPicker from "emoji-picker-react";

import GifIcon from "@/assets/gifIcon.svg";
import SmallImageIcon from "@/assets/smallImgIcon.svg";
import SmileyIcon from "@/assets/smileyIcon.svg";
import SendIcon from "@/assets/send.svg";
import HeartIcon from "@/assets/heartIcon.svg";
import { handleOnError } from "@/libs/utils";
import { ActivePoll, InactivePoll } from "@/features/ProfileSections/Polls";
import { useCommentOnPoll, useGetAllCommentsOnPoll } from "@/api/profile";
import { useTypedSelector } from "@/hooks/hooks";
import { axios } from "@/libs/axios";
import notify from "@/libs/toast";

const Image = styled.img``;

const PollCard = ({
  post,
  index,
  setShowSinglePoll,
  setShowPopover,
  setClickedIndex,
  setPollIndex,
  setChosenPost,
  showPopover,
  clickedIndex,
}: {
  post: any;
  index: number;
  setShowSinglePoll: any;
  setShowPopover: any;
  setClickedIndex: any;
  setPollIndex: any;
  setChosenPost: any;
  showPopover: boolean;
  clickedIndex: number;
}) => {
  const tenorAPIKey = "AIzaSyDD20z7z4I7LitEK4TZzYyY9nXwkKind1A";

  const { data: session } = useSession();

  const TOKEN = session?.user?.access;
  const { userInfo } = useTypedSelector((state) => state.profile);

  const { mutate: commentOnPoll, isLoading: isCommentingOnPoll } =
    useCommentOnPoll();

  const { data: commentsOnPoll } = useGetAllCommentsOnPoll({
    token: TOKEN as string,
    pollId: post?.id,
  });

  const [inputComment, setInputComment] = useState("");
  const [emptyComment, setEmptyComment] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openGifPicker, setOpenGifPicker] = useState(false);

  const [isLikingOrUnlikingPoll, setIsLikingOrUnlikingPoll] = useState(false);

  const queryClient = useQueryClient();

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] py-[10px] px-[15px] flex flex-col gap-y-[7px]">
        <p
          onClick={() => {
            setShowSinglePoll(true);
            setShowPopover(false);
          }}
          className="text-brand-600 text-[10px] font-medium leading-[15px] cursor-pointer"
        >
          View Poll
        </p>
      </div>
    );
  };

  return (
    <div className="w-full mb-[25px] rounded-[8px] bg-brand-500 shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] basis-[100%] md:basis-[48%] pt-[21px] px-[23px]">
      <div className="flex items-center justify-between mb-[35px]">
        <div className="flex items-center">
          <div className="mr-[7px]">
            <img
              src={
                post?.author?.image !== null
                  ? post?.author?.image
                  : "/profileIcon.svg"
              }
              alt="post image"
              className="object-cover w-[40px] h-[40px] rounded-[50%] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
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
        {post?.author?.id === session?.user?.id ||
        post?.voted ||
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
          <b className="font-semibold">{post?.total_vote_count}</b> vote
          {post?.total_vote_count > 1 && "s"}
        </div>
        <div className="border border-t-transparent border-b-transparent border-l-brand-2750 border-r-brand-2750 px-[40px]">
          {parseInt(post?.duration?.split(" ")[0]) > 0 && (
            <>
              <b className="font-semibold">{post?.duration?.split(" ")[0]}</b>{" "}
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

      <div className="flex -mx-[22px] justify-between items-center border border-b-0 border-x-0 border-t-1 border-brand-2500 py-[12px] md:py-[21px] px-[14px] md:px-[19px]">
        <div
          className="flex flex-col cursor-pointer items-center"
          onClick={async (e) => {
            e?.preventDefault();
            setIsLikingOrUnlikingPoll(true);
            await axios
              .get(`/poll/${post?.id}/like/`, {
                headers: { Authorization: "Bearer " + (TOKEN as string) },
              })
              .then(() => {
                queryClient.invalidateQueries(["getPolls"]);
                queryClient.invalidateQueries(["getNewsfeed"]);
              })
              .catch((err) => {
                notify({ type: "error", text: err?.response?.data?.message });
              })
              .finally(() => {
                setIsLikingOrUnlikingPoll(false);
              });
          }}
        >
          {isLikingOrUnlikingPoll ? (
            <BeatLoader
              color={"orange"}
              size={10}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <>
              <div className="mb-[5px] flex">
                <div>
                  {post?.is_liked === true ? (
                    <HeartIcon2 className="h-[20px] w-[20px] text-brand-love" />
                  ) : (
                    <NextImage src={HeartIcon} alt="heart" />
                  )}
                </div>
                <p
                  className={
                    "font-medium text-[13px] ml-[3px] " +
                    `${
                      post?.is_liked === true
                        ? "text-brand-love"
                        : "text-brand-2550"
                    }`
                  }
                >
                  {post?.like_count}
                </p>
              </div>

              <p
                className={
                  "text-[9px] font-medium leading-[14px] " +
                  `${
                    post?.is_liked === true
                      ? "text-brand-love"
                      : "text-brand-2550"
                  }`
                }
              >
                Like{post?.like_count > 1 && "s"}
              </p>
            </>
          )}
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowComments(!showComments)}
        >
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
        <div className="flex flex-col items-center cursor-pointer">
          <div className="flex gap-x-[3px] mb-[5px]">
            <NextImage
              className="cursor-pointer"
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
      </div>
      {showComments && commentsOnPoll?.results?.length > 0 && (
        <div className="w-full h-[125px] overflow-x-scroll bg-brand-1000 flex flex-col gap-y-[10px] pt-[10px] px-[12px] py-[12px]">
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
              <div className="pl-[15px]">
                <p className="text-[11px]">
                  {comment?.author?.firstname} {comment?.author?.lastname}
                </p>
                <p className="text-[14px]">{comment?.comment_text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="py-[12px] md:py-[21px] flex w-full items-center">
        <div className="mr-[9px]">
          <img
            src={
              userInfo?.profile?.user?.image !== null
                ? userInfo?.profile?.user?.image
                : "/profileIcon.svg"
            }
            alt="session image"
            className="object-cover w-[40px] h-[40px] rounded-[50%]"
            onError={handleOnError}
          />
        </div>

        <div className="w-[calc(100%-90px)] relative h-[30px] bg-brand-1600 rounded-[6px] flex">
          <div className="w-[80%]">
            <input
              className="focus:outline-0 w-full rounded-[6px] h-[30px] bg-inherit ml-[10px] focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0 text-[16px] placeholder:text-[11px] md:placeholder:text-[13px] placeholder:font-light placeholder:text-brand-200 placeholder: leading-[16px]"
              placeholder="Write a comment.."
              onChange={(e) => setInputComment(e?.target?.value)}
              value={inputComment}
            />
            {emptyComment && (
              <p className="text-[11px] text-red">
                Please write a comment before you hit send
              </p>
            )}
          </div>

          <div className="absolute flex right-[0px] h-[100%] mr-[10px] gap-x-[4px]">
            <div className="flex justify-center align-center">
              <NextImage
                src={GifIcon}
                alt="gif"
                className="cursor-pointer"
                onClick={() => setOpenGifPicker(true)}
              />
              {openGifPicker && (
                <div className="absolute z-[999] top-[25px]">
                  <GifPicker
                    tenorApiKey={tenorAPIKey}
                    onGifClick={(e) => {
                      setInputComment(inputComment + e?.shortTenorUrl);
                      setOpenGifPicker(false);
                    }}
                  />
                </div>
              )}
            </div>
            <NextImage
              src={SmallImageIcon}
              alt="img small"
              className="cursor-pointer"
            />
            <div className="flex justify-center align-center">
              <NextImage
                src={SmileyIcon}
                alt="smiley"
                className="cursor-pointer"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              />
              {openEmojiPicker && (
                <div className="absolute z-[999] top-[25px]">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setInputComment(inputComment + e?.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            setEmptyComment(false);
            if (!inputComment) {
              setEmptyComment(true);
            } else {
              inputComment &&
                commentOnPoll(
                  {
                    pollId: post?.id,
                    body: { comment: inputComment },
                    token: TOKEN as string,
                  },
                  {
                    onSuccess: () => {
                      setInputComment("");
                      queryClient.invalidateQueries(["getNewsfeed"]);
                      queryClient.invalidateQueries(["getAllCommentsOnPoll"]);
                      queryClient.invalidateQueries(["getPolls"]);
                    },
                  }
                );
            }
          }}
          className="w-[30px] h-[30px] bg-brand-comment-send flex justify-center items-center cursor-pointer rounded-[6px] ml-[11px]"
        >
          {isCommentingOnPoll ? (
            <BounceLoader
              color={"white"}
              size={10}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <NextImage src={SendIcon} alt="send" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PollCard;
