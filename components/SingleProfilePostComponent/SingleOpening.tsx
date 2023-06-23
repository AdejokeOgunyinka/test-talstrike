/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import NextImage from "next/image";
import { HeartIcon as HeartIcon2 } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import moment from "moment";
import styled from "styled-components";
import { BounceLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";

import HeartIcon from "@/assets/heartIcon.svg";
import { useAddViewCount } from "@/api/explore";
import { handleMediaPostError, handleOnError } from "@/libs/utils";
import { TextBox } from "@/components/ProfileModals/InputBox";
import { useCommentOnPost, useGetAllCommentsOnPost } from "@/api/dashboard";
import { useGetMyProfile } from "@/api/profile";

const Image = styled.img``;

const SingleOpening = ({
  setShowSingleOpening,
  chosenPost,
  seconds,
}: {
  setShowSingleOpening: any;
  chosenPost: any;
  seconds: number;
}) => {
  const [inputComment, setInputComment] = useState("");
  const [emptyComment, setEmptyComment] = useState(false);

  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const { mutate: addViewCount } = useAddViewCount();

  const queryClient = useQueryClient();

  const { mutate: commentOnPost, isLoading: isCommenting } = useCommentOnPost();

  const { data: commentsOnPost } = useGetAllCommentsOnPost({
    token: TOKEN as string,
    postId: chosenPost?.id,
  });

  const { data: userProfile } = useGetMyProfile({
    token: TOKEN as string,
    userId: session?.user?.id as string,
  });

  return (
    <div className="w-full p-[24px] rounded-[4px]">
      <div className="w-full bg-brand-500 divide-y divide-brand-1150">
        <div className="py-[27px] px-[33px]">
          <div className="flex justify-between items-center mb-[32px]">
            <div className="flex gap-x-[7px] items-center">
              <img
                src={
                  chosenPost?.author?.image !== null
                    ? chosenPost?.author?.image
                    : "/profileIcon.svg"
                }
                alt="post image"
                className="object-cover w-[40px] h-[40px] rounded-[50%] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                onError={handleOnError}
              />
              <div>
                <h4 className="text-brand-2250 font-semibold text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px]">
                  {chosenPost?.author?.firstname} {chosenPost?.author?.lastname}
                </h4>
                <h4 className="text-[#94AEC5] font-medium text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[15px]">
                  {moment(chosenPost?.created_at)?.format("ll")}
                </h4>
              </div>
            </div>
            <div className="text-brand-2250 font-semibold flex items-center align-center gap-x-[5px]">
              {/* <p className="text-[27.7232px] pb-[10px]">...</p> */}
              <div
                onClick={() => {
                  if (seconds > 4) {
                    addViewCount({
                      view_time: seconds,
                      post: chosenPost?.id,
                      token: TOKEN as string,
                    });
                  }
                  setShowSingleOpening(false);
                }}
                className="cursor-pointer"
              >
                <img src="/closeIconBlue.svg" alt="close blue" />
              </div>
            </div>
          </div>
          <h4 className="mt-[14px] font-semibold text-brand-1650 text-[11px] lg:text-[16px] ">
            {chosenPost?.title}
          </h4>
          <p className="mt-[4px] font-normal leading-[16px] text-[12px]  mb-[9px]">
            {chosenPost?.body}
          </p>
        </div>
        <div className="w-full">
          {chosenPost?.media && (
            <>
              {chosenPost?.file_type === "VIDEO" ? (
                <video src={chosenPost?.media} controls className="w-full" />
              ) : (
                <Image
                  src={chosenPost?.media}
                  alt="post img"
                  onError={handleMediaPostError}
                  className="w-full object-cover"
                />
              )}
            </>
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
        <div className="w-full py-[49px] px-[29px]">
          <div className="w-full flex gap-x-[28px]">
            <img
              src={
                userProfile?.user?.image !== null
                  ? userProfile?.user?.image
                  : "/profileIcon.svg"
              }
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
                    commentOnPost(
                      {
                        postId: chosenPost?.id,
                        body: inputComment,
                        token: TOKEN as string,
                      },
                      {
                        onSuccess: () => {
                          setInputComment("");
                          queryClient.invalidateQueries([
                            "getAllCommentsOnPost",
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
        {commentsOnPost?.results?.length === 0 ? (
          <div className="w-full py-[42px] px-[36px]">
            <p>No comments on this post yet...</p>
          </div>
        ) : (
          <div className="w-full py-[42px] px-[36px] flex flex-col gap-y-[36px]">
            {commentsOnPost?.results?.map((comment: any, index: number) => (
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
  );
};

export default SingleOpening;
