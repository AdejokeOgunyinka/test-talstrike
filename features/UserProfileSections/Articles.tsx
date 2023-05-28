/* eslint-disable @next/next/no-img-element */
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import moment from "moment";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  HeartIcon as HeartIcon2,
} from "@heroicons/react/24/solid";
import BounceLoader from "react-spinners/BounceLoader";
import { useQueryClient } from "@tanstack/react-query";

import HeartIcon from "@/assets/heartIcon.svg";
import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetMyProfile, useGetPostsByType } from "@/api/profile";
import { useCommentOnPost, useGetAllCommentsOnPost } from "@/api/dashboard";
import { handleMediaPostError, handleOnError } from "@/libs/utils";
import { TextBox } from "@/components/ProfileModals/InputBox";

const Image = styled.img``;

const MyArticles = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();
  const { id } = router.query;

  const { data: userPosts, isLoading: isLoadingUserPosts } = useGetPostsByType({
    token: TOKEN as string,
    userId: id as string,
    post_type: "ARTICLE",
  });

  const { data: userProfile } = useGetMyProfile({
    token: TOKEN as string,
    userId: id as string,
  });

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [postIndex, setPostIndex] = useState("");
  const [chosenPost, setChosenPost] = useState<any>(null);

  const queryClient = useQueryClient();

  const { mutate: commentOnPost, isLoading: isCommenting } = useCommentOnPost();

  const { data: commentsOnPost } = useGetAllCommentsOnPost({
    token: TOKEN as string,
    postId: postIndex,
  });

  const [showSingleArticle, setShowSingleArticle] = useState(false);

  const [inputComment, setInputComment] = useState("");
  const [emptyComment, setEmptyComment] = useState(false);

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[113px] py-[14px] px-[17px] flex flex-col gap-y-[6px]">
        <p
          onClick={() => {
            setShowSingleArticle(true);
            setShowPopover(false);
          }}
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
        >
          View Article
        </p>
      </div>
    );
  };

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  return (
    <div className="mt-[21px] w-full">
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          {`${userProfile?.user?.firstname}'s`} Articles
        </h3>
      </div>

      {showSingleArticle === true ? (
        <div className="w-full p-[24px] rounded-[4px]">
          <div className="w-full mb-[10px]">
            <ArrowLeftIcon
              className="w-[20px] h-[20px] cursor-pointer"
              onClick={() => setShowSingleArticle(false)}
            />
          </div>
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
                      {chosenPost?.author?.firstname}{" "}
                      {chosenPost?.author?.lastname}
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
                    <video
                      src={chosenPost?.media}
                      controls
                      className="w-full"
                    />
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
                    chosenPost?.author?.image !== null
                      ? chosenPost?.author?.image
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
      ) : (
        <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
          {isLoadingUserPosts ? (
            <SkeletonLoader />
          ) : userPosts?.results?.length === 0 || !userPosts?.results ? (
            <p>No article available at the moment...</p>
          ) : (
            userPosts?.results?.map((post: any, index: number) => (
              <div
                key={index}
                className="rounded-[8px] relative bg-brand-500 shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] basis-[100%] md:basis-[48%] pt-[21px] px-[23px] w-full md:w-[45%]"
              >
                <div className="flex items-center justify-between mb-[25px]">
                  <div className="flex items-center">
                    <div className="mr-[7px] rounded-[100%] w-[39px] h-[39px] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]">
                      <NextImage
                        src={post?.author?.image}
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
                        setPostIndex(post?.id);
                        setChosenPost(post);
                        setShowPopover(!showPopover);
                      }}
                    >
                      ...
                    </p>
                    {showPopover && clickedIndex === index && <Popover />}
                  </div>
                </div>

                <div className="relative mb-[20px] rounded-[4px] overflow-hidden flex justify-center">
                  {post?.media && (
                    <>
                      {post?.file_type === "VIDEO" ? (
                        <video src={post?.media} controls />
                      ) : (
                        <Image src={post?.media} alt="post img" />
                      )}
                    </>
                  )}
                  <div
                    className={`rounded-[4px] w-[68px] h-[30px] flex justify-center items-center absolute ${
                      post?.post_type === "VIDEO"
                        ? "bottom-[60px]"
                        : "bottom-[21.75px]"
                    } bg-brand-2250 left-[15px] py-[4px] px-[10px] text-[11px] leading-[16px] font-semibold text-brand-500`}
                  >
                    Article
                  </div>
                </div>

                <p className="text-brand-1750 mb-[5px] text-[14px] font-semibold leading-[21px]">
                  {post?.title}
                </p>
                <p className="font-normal  text-[10px] mb-[98px] leading-[15px] text-brand-50">
                  {post?.body}
                </p>

                <div className="h-[78px] absolute bottom-0 bg-brand-500 w-full px-[19px] border -mx-[22px] border-b-0 border-x-0 border-t-1 border-brand-2500 flex items-center justify-between">
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
                      Likes
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
        userPosts?.results &&
        userPosts?.results?.length !== 0 && (
          <div className="mt-[45px] w-full flex justify-center items-center">
            <button className="w-[146px] bg-brand-600 h-[41px] rounded-[19px] text-brand-500 text-[14px] leading-[21px]">
              Load More
            </button>
          </div>
        )}
    </div>
  );
};

export default MyArticles;
