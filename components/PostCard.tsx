/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import { useSession } from "next-auth/react";
import BeatLoader from "react-spinners/BeatLoader";
import BounceLoader from "react-spinners/BounceLoader";
import moment from "moment";
import { HeartIcon as HeartIcon2 } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "gif-picker-react";

import HeartIcon from "@/assets/heartIcon.svg";
// import ShareIcon from "@/assets/shareIcon.svg";
import GifIcon from "@/assets/gifIcon.svg";
import SmallImageIcon from "@/assets/smallImgIcon.svg";
import SmileyIcon from "@/assets/smileyIcon.svg";
import SendIcon from "@/assets/send.svg";

import {
  useLikeUnlikePost,
  useCommentOnPost,
  useGetAllCommentsOnPost,
} from "@/api/dashboard";
import { useTypedSelector } from "@/hooks/hooks";
import { handleMediaPostError, handleOnError } from "@/libs/utils";
import ShareModal from "./ShareModal";

const PostCard = ({
  postType,
  postImage,
  postAuthor,
  timeCreated,
  postBody,
  postMedia,
  postLikedAvatars,
  postLikeCount,
  postCommentCount,
  postShareCount,
  postId,
  liked,
  isLoadingPost,
  postTitle,
  fileType,
  post,
  onClickViewPost,
}: {
  postType: string;
  postImage: string;
  postAuthor: string;
  timeCreated: string;
  postBody: string;
  postMedia: string;
  postLikedAvatars: any;
  postLikeCount: number;
  postCommentCount: number;
  postShareCount: number;
  postId: string;
  liked: any;
  isLoadingPost: boolean;
  postTitle: string;
  fileType: string;
  post: any;
  onClickViewPost: any;
}) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { userInfo } = useTypedSelector((state) => state.profile);

  const { mutate: likeUnlikePost, isLoading: isLikingOrUnlikingPost } =
    useLikeUnlikePost();
  const { mutate: commentOnPost, isLoading: isCommenting } = useCommentOnPost();

  const [inputComment, setInputComment] = useState("");
  const [emptyComment, setEmptyComment] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { data: commentsOnPost } = useGetAllCommentsOnPost({
    token: TOKEN as string,
    postId: postId,
  });

  const queryClient = useQueryClient();
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openGifPicker, setOpenGifPicker] = useState(false);

  const slicedBody = postBody?.slice(0, 200);
  const [showFullBody, setShowFullBody] = useState(false);

  const tenorAPIKey = "AIzaSyDD20z7z4I7LitEK4TZzYyY9nXwkKind1A";

  const [showPopover, setShowPopover] = useState(false);

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] py-[14px] px-[17px] flex flex-col gap-y-[6px]">
        <p
          onClick={() => {
            onClickViewPost();
            setShowPopover(false);
          }}
          className="text-brand-600 text-[10px] font-medium leading-[15px] cursor-pointer"
        >
          View {postType}
        </p>
      </div>
    );
  };

  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  return (
    // <div className="p-[10px] relative md:p-[14px] w-[100%] divide-y divide-brand-1150 mb-[28px] shadow shadow-[0px_5px_14px_rgba(0, 0, 0, 0.09)] rounded-[12px] bg-brand-500">
    //   <div>
    //     <div className="flex justify-between">
    //       <div className="flex items-center">
    //         <img
    //           src={postImage !== null ? postImage : "/profileIcon.svg"}
    //           alt="post image"
    //           className="object-cover w-[40px] h-[40px] rounded-[50%]"
    //           onError={handleOnError}
    //         />

    //         <div className="ml-[10px]">
    //           <h4 className="text-brand-50 font-semibold text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px]">
    //             {postAuthor}
    //           </h4>
    //           <h4 className="text-brand-200 font-medium text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[15px]">
    //             {moment(timeCreated)?.format("ll")}
    //           </h4>
    //         </div>
    //       </div>
    //       <div>
    //         <p className="font-semibold cursor-pointer text-[20px] leading-[30px] text-brand-50">
    //           ...
    //         </p>
    //       </div>
    //     </div>
    //     <h4 className="mt-[14px]">{postTitle}</h4>
    //     <p className="mt-[4px] text-brand-50 font-normal leading-[16px] text-[11px] lg:text-[13px] 2xl:text-[15px] mb-[6px]">
    //       {showFullBody ? postBody : `${slicedBody}...`}
    //     </p>
    //     {postBody?.length > 200 && (
    //       <p
    //         className="cursor-pointer text-[13px]"
    //         onClick={() =>
    //           showFullBody ? setShowFullBody(false) : setShowFullBody(true)
    //         }
    //       >
    //         {showFullBody ? "Show Less" : "Read More"}
    //       </p>
    //     )}

    //     {postMedia && (
    //       <div className="relative w-full h-full flex justify-center items-center maxH-[1500px] maxW-[500px]">
    //         {isLoadingPost ? (
    //           <SkeletonTheme
    //             baseColor="rgba(0, 116, 217, 0.18)"
    //             highlightColor="#fff"
    //           >
    //             <section>
    //               <Skeleton height={300} width="100%" />
    //             </section>
    //           </SkeletonTheme>
    //         ) : (
    //           <>
    //             {fileType === "VIDEO" && postMedia ? (
    //               <video src={postMedia} controls />
    //             ) : (
    //               postMedia && <Image src={postMedia} alt="post img" />
    //             )}
    //           </>
    //         )}
    //       </div>
    //     )}
    //     <div className="flex mt-[10px] ml-[5px] flex justify-between">
    //       <div className="flex">
    //         {postLikedAvatars?.slice(0, 3)?.map((like: any, index: number) => (
    //           <div className="-ml-[7px]" key={index}>
    //             <img
    //               src={like}
    //               alt="icons"
    //               className="w-[20px] h-[20px] rounded-[50%]"
    //             />
    //           </div>
    //         ))}
    //         {postLikeCount > 3 ? (
    //           <div className="-ml-[7px] w-[20px] h-[20px] bg-brand-1200 flex justify-center items-center rounded-[50%] z-[10]">
    //             <p className="font-semibold text-[9px] leading-[14px] text-brand-500">
    //               {postLikeCount - 3}+
    //             </p>
    //           </div>
    //         ) : (
    //           <div className="-ml-[7px] w-[20px] h-[20px] bg-brand-1200 flex justify-center items-center rounded-[50%] z-[10]">
    //             <p className="font-semibold text-[9px] leading-[14px] text-brand-500">
    //               {postLikeCount}
    //             </p>
    //           </div>
    //         )}
    //       </div>
    //       <div className="flex text-[11px] text-brand-90 lg:text-[12px] 2xl:text-[13px] leading-[16px] font-medium">
    //         <p
    //           className="mr-[11px] cursor-pointer"
    //           onClick={() => setShowComments(!showComments)}
    //         >
    //           {postCommentCount} Comments
    //         </p>
    //         <p>{postShareCount} Shares</p>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="mt-[12px] w-full h-[30px] flex justify-between items-center">
    //     <div
    //       className="flex cursor-pointer items-center"
    //       onClick={() => {
    //         likeUnlikePost(
    //           { token: TOKEN as string, postId: postId },
    //           {
    //             onSuccess: () => queryClient.invalidateQueries(["getNewsfeed"]),
    //           }
    //         );
    //       }}
    //     >
    //       {isLikingOrUnlikingPost ? (
    //         <BeatLoader
    //           color={"orange"}
    //           size={10}
    //           aria-label="Loading Spinner"
    //           data-testid="loader"
    //         />
    //       ) : (
    //         <>
    //           {liked?.status === true ? (
    //             <HeartIcon2 className="h-[20px] w-[20px] text-brand-love" />
    //           ) : (
    //             <NextImage src={HeartIcon} alt="heart" />
    //           )}
    //           <p
    //             className={
    //               "ml-[5px] text-[11px] leading-[16px] font-normal " +
    //               `${
    //                 liked?.status === true
    //                   ? "text-brand-love "
    //                   : "text-brand-50"
    //               }`
    //             }
    //           >
    //             Like
    //           </p>
    //         </>
    //       )}
    //     </div>

    //     <div className="flex cursor-pointer">
    //       <NextImage src={ShareIcon} alt="share" />
    //       <p className="ml-[5px] text-[11px] leading-[16px] text-brand-50 font-normal">
    //         Share
    //       </p>
    //     </div>
    //   </div>
    //   {showComments && commentsOnPost?.results?.length > 0 && (
    //     <div className="w-full h-[125px] overflow-x-scroll bg-brand-1000 flex flex-col gap-y-[10px] pt-[10px] px-[12px] py-[12px]">
    //       {commentsOnPost?.results?.map((comment: any, index: number) => (
    //         <div className="flex items-center" key={index}>
    //           <img
    //             src={
    //               comment?.author?.image !== null
    //                 ? comment?.author?.image
    //                 : "/profileIcon.svg"
    //             }
    //             alt="author"
    //             className="object-cover w-[40px] h-[40px] rounded-[50%]"
    //             onError={handleOnError}
    //           />
    //           <div className="pl-[15px]">
    //             <p className="text-[11px]">
    //               {comment?.author?.firstname} {comment?.author?.lastname}
    //             </p>
    //             <p className="text-[18px]">{comment?.body}</p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    //   <div className="w-full pt-[9px] flex items-center justify-between">
    //     <div className="w-[40px] h-[40px]">
    //       <img
    //         src={
    //           userInfo?.profile?.user?.image !== null
    //             ? userInfo?.profile?.user?.image
    //             : "/profileIcon.svg"
    //         }
    //         alt="session image"
    //         className="object-cover w-[40px] h-[40px] rounded-[50%]"
    //         onError={handleOnError}
    //       />
    //     </div>

    //     <div className="w-[80%] relative h-[30px] bg-brand-1600 rounded-[6px] flex">
    //       <div className="w-[83%]">
    //         <input
    //           className="focus:outline-0 w-full rounded-[6px] bg-inherit ml-[10px] focus:ring-offset-0 focus:ring-shadow-0 focus:outline-offset-0 text-[19px] placeholder:text-[9px] md:placeholder:text-[13px] placeholder:font-light placeholder:text-brand-200 placeholder: leading-[16px]"
    //           placeholder="Write a comment.."
    //           onChange={(e) => setInputComment(e?.target?.value)}
    //           value={inputComment}
    //         />
    //         {emptyComment && (
    //           <p className="text-[11px] text-red">
    //             Please write a comment before you hit send
    //           </p>
    //         )}
    //       </div>

    //       <div className="absolute flex right-[0px] h-[100%] mr-[10px] gap-x-[4px]">
    //         <div className="flex justify-center align-center">
    //           <NextImage
    //             src={GifIcon}
    //             alt="gif"
    //             className="cursor-pointer"
    //             onClick={() => setOpenGifPicker(true)}
    //           />
    //           {openGifPicker && (
    //             <div className="absolute z-[999] top-[25px]">
    //               <GifPicker
    //                 tenorApiKey={tenorAPIKey}
    //                 onGifClick={(e) => {
    //                   setInputComment(inputComment + e?.shortTenorUrl);
    //                   setOpenGifPicker(false);
    //                 }}
    //               />
    //             </div>
    //           )}
    //         </div>
    //         <NextImage
    //           src={SmallImageIcon}
    //           alt="img small"
    //           className="cursor-pointer"
    //         />
    //         <div className="flex justify-center align-center">
    //           <NextImage
    //             src={SmileyIcon}
    //             alt="smiley"
    //             className="cursor-pointer"
    //             onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
    //           />
    //           {openEmojiPicker && (
    //             <div className="absolute z-[999] top-[25px]">
    //               <EmojiPicker
    //                 onEmojiClick={(e) => {
    //                   setInputComment(inputComment + e?.emoji);
    //                   setOpenEmojiPicker(false);
    //                 }}
    //               />
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    //     <div
    //       onClick={() => {
    //         setEmptyComment(false);
    //         if (!inputComment) {
    //           setEmptyComment(true);
    //         } else {
    //           inputComment &&
    //             commentOnPost(
    //               {
    //                 postId: postId,
    //                 body: inputComment,
    //                 token: TOKEN as string,
    //               },
    //               {
    //                 onSuccess: () => {
    //                   setInputComment("");
    //                   queryClient.invalidateQueries(["getNewsfeed"]);
    //                   queryClient.invalidateQueries(["getAllCommentsOnPost"]);
    //                 },
    //               }
    //             );
    //         }
    //       }}
    //       className="w-[30px] h-[30px] bg-brand-comment-send flex justify-center items-center cursor-pointer rounded-[6px]"
    //     >
    //       {isCommenting ? (
    //         <BounceLoader
    //           color={"white"}
    //           size={10}
    //           aria-label="Loading Spinner"
    //           data-testid="loader"
    //         />
    //       ) : (
    //         <NextImage src={SendIcon} alt="send" />
    //       )}
    //     </div>
    //   </div>
    // </div>

    <>
      <div className="relative  w-[100%] divide-y divide-brand-1150 mb-[29px] shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] rounded-[8px] bg-brand-500">
        <div className="py-[12px] md:py-[21px] px-[14px] md:px-[23px]">
          <div className="flex justify-between mb-[25px]">
            <div className="flex gap-x-[7px] items-center">
              <img
                src={postImage !== null ? postImage : "/profileIcon.svg"}
                alt="post image"
                className="object-cover w-[40px] h-[40px] rounded-[50%] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                onError={handleOnError}
              />
              <div>
                <h4 className="text-brand-2250 font-semibold text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[16px]">
                  {postAuthor}
                </h4>
                <h4 className="text-[#94AEC5] font-medium text-[11px] lg:text-[13px] 2xl:text-[15px] leading-[15px]">
                  {moment(timeCreated)?.format("ll")}
                </h4>
              </div>
            </div>
            <div
              onClick={(e) => e?.stopPropagation()}
              className="text-brand-2250 font-semibold text-[27.7232px] relative"
            >
              <p
                onClick={() => {
                  setShowPopover(!showPopover);
                }}
                className="cursor-pointer"
              >
                ...
              </p>
              {showPopover && <Popover />}
            </div>
          </div>
          <div className={`mb-[15px] ${postMedia ? "mb-[15px]" : "mb-0"}`}>
            <h4 className="mt-[14px] font-semibold text-brand-1650 text-[11px] lg:text-[16px] ">
              {postTitle}
            </h4>
            <p className="mt-[4px] font-normal leading-[16px] text-[12px]  mb-[9px]">
              {showFullBody
                ? postBody
                : `${slicedBody}${postBody?.length > 200 ? "..." : ""}`}
            </p>
            {postBody?.length > 200 && (
              <p
                className="cursor-pointer text-[12px]"
                onClick={() =>
                  showFullBody ? setShowFullBody(false) : setShowFullBody(true)
                }
              >
                {showFullBody ? "Show Less" : "Read More"}
              </p>
            )}
          </div>
          {postMedia && (
            <div className="mb-[31px]">
              <div className="relative w-full h-full flex justify-center items-center maxH-[1500px] maxW-[500px]">
                {isLoadingPost ? (
                  <SkeletonTheme
                    baseColor="rgba(0, 116, 217, 0.18)"
                    highlightColor="#fff"
                  >
                    <section>
                      <Skeleton height={300} width="100%" />
                    </section>
                  </SkeletonTheme>
                ) : (
                  <>
                    {fileType === "VIDEO" && postMedia ? (
                      <video
                        src={postMedia}
                        controls
                        onError={handleMediaPostError}
                        className="w-full h-[170px]"
                      />
                    ) : (
                      fileType === "IMAGE" &&
                      postMedia && (
                        <img
                          src={postMedia}
                          alt="post img"
                          onError={handleMediaPostError}
                          className="w-full h-[170px] object-cover"
                        />
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex w-full justify-between py-[12px] md:py-[21px] px-[14px] md:px-[23px]">
          <div
            className="flex flex-col cursor-pointer items-center"
            onClick={() => {
              likeUnlikePost(
                { token: TOKEN as string, postId: postId },
                {
                  onSuccess: () =>
                    queryClient.invalidateQueries(["getNewsfeed"]),
                }
              );
            }}
          >
            {isLikingOrUnlikingPost ? (
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
                    {liked?.status === true ? (
                      <HeartIcon2 className="h-[20px] w-[20px] text-brand-love" />
                    ) : (
                      <NextImage src={HeartIcon} alt="heart" />
                    )}
                  </div>
                  <p
                    className={
                      "font-medium text-[13px] ml-[3px] " +
                      `${
                        liked?.status === true
                          ? "text-brand-love"
                          : "text-brand-2550"
                      }`
                    }
                  >
                    {postLikeCount}
                  </p>
                </div>

                <p
                  className={
                    "text-[9px] font-medium leading-[14px] " +
                    `${
                      liked?.status === true
                        ? "text-brand-love"
                        : "text-brand-2550"
                    }`
                  }
                >
                  Like{postLikeCount > 1 && "s"}
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
                {postCommentCount}
              </p>
            </div>
            <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
              Comments
            </p>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <div
              className="flex gap-x-[3px] mb-[5px]"
              onClick={() => setShowShareModal(!showShareModal)}
            >
              <NextImage
                className="cursor-pointer"
                src="/arrow2.svg"
                width="15"
                height="15"
                alt="arrow"
              />
              <p className="text-brand-2250 font-medium text-[13px]">
                {postShareCount}
              </p>
            </div>
            <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
              Shares
            </p>
          </div>
        </div>
        {showComments && commentsOnPost?.results?.length > 0 && (
          <div className="w-full h-[125px] overflow-x-scroll bg-brand-1000 flex flex-col gap-y-[10px] pt-[10px] px-[12px] py-[12px]">
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
                <div className="pl-[15px]">
                  <p className="text-[11px]">
                    {comment?.author?.firstname} {comment?.author?.lastname}
                  </p>
                  <p className="text-[14px]">{comment?.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="py-[12px] md:py-[21px] px-[14px] md:px-[23px] flex w-full items-center">
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
                  commentOnPost(
                    {
                      postId: postId,
                      body: inputComment,
                      token: TOKEN as string,
                    },
                    {
                      onSuccess: () => {
                        setInputComment("");
                        queryClient.invalidateQueries(["getNewsfeed"]);
                        queryClient.invalidateQueries(["getAllCommentsOnPost"]);
                      },
                    }
                  );
              }
            }}
            className="w-[30px] h-[30px] bg-brand-comment-send flex justify-center items-center cursor-pointer rounded-[6px] ml-[11px]"
          >
            {isCommenting ? (
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

      {showShareModal && (
        <ShareModal post={post} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
};

export default PostCard;
