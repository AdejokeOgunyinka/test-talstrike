import NextImage from "next/image";
import { useRouter } from "next/router";
import moment from "moment";
import styled from "styled-components";

import {
  handleMediaPostError,
  handleOnError,
  uppercaseFirsLetter,
} from "@/libs/utils";
import { useState } from "react";
import ShareModal from "../ShareModal";

const Image = styled.img``;

const SinglePostCard = ({
  post,
  setShowPopover,
  showPopover,
  setShowDeleteModal,
  setShowEditModal,
  setPostIndex,
  setChosenPost,
  index,
  clickedIndex,
  setClickedIndex,
  isOther,
}: {
  post: any;
  setClickedIndex: any;
  setShowPopover: any;
  showPopover: boolean;
  showSinglePost: boolean;
  setShowDeleteModal?: any;
  setShowEditModal?: any;
  setPostIndex: any;
  setChosenPost: any;
  index: number;
  clickedIndex: number;
  isOther?: boolean;
}) => {
  const handleClickDelete = () => {
    setShowDeleteModal(true);
    setShowPopover(false);
  };

  const handleClickEditModal = () => {
    setShowEditModal(true);
    setShowPopover(false);
  };

  const router = useRouter();

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] h-[83px] py-[11px] px-[15px] flex flex-col gap-y-[6px]">
        <p
          onClick={() =>
            router.push({
              pathname: `/posts/${post?.id}`,
              query: { type: post?.post_type?.toLowerCase() },
            })
          }
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
        >
          View Post
        </p>
        {/* <p className="text-brand-600 text-[10px] font-medium leading-[15px]">View Insight</p> */}
        <p
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
          onClick={handleClickEditModal}
        >
          Edit Post
        </p>
        <p
          className="text-brand-2600 text-[10px] font-medium leading-[15px]"
          onClick={handleClickDelete}
        >
          Delete Post
        </p>
      </div>
    );
  };

  const Popover2 = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] py-[10px] px-[15px] flex flex-col gap-y-[6px]">
        <p
          onClick={() =>
            router.push({
              pathname: `/posts/${post?.id}`,
              query: { type: post?.post_type?.toLowerCase() },
            })
          }
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
        >
          View Post
        </p>
      </div>
    );
  };

  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div className="rounded-[8px] relative bg-brand-500 border border-1 border-brand-stroke basis-[100%] md:basis-[48%] pt-[21px] px-[23px] w-full md:w-[45%] min-h-[300px]">
        <div className="flex items-center justify-between mb-[25px]">
          <div className="flex items-center">
            <div className="mr-[7px] ">
              <NextImage
                src={post?.author?.image}
                alt="post creator"
                width="42"
                height="42"
                className="mr-[7px] rounded-[100%] w-[42px] h-[42px]"
                onError={handleOnError}
              />
            </div>

            <div>
              <p className="mb-[6.18px] font-semibold text-[18px] leading-[16px] text-brand-text">
                {post?.author?.firstname} {post?.author?.lastname}
              </p>
              <p className="font-medium text-[10px] leading-[15px] text-brand-grey-1">
                {uppercaseFirsLetter(post?.author?.roles[0])} |{" "}
                {moment(post?.created_at).format("dddd Do MMMM")}
              </p>
            </div>
          </div>
          <div
            className="cursor-pointer relative"
            onClick={(e) => e?.stopPropagation()}
          >
            <p
              className="text-brand-text text-[27.7px] leading-[0px] pb-[10px] font-semibold"
              onClick={() => {
                setPostIndex(post?.id);
                setChosenPost(post);
                setClickedIndex(index);
                setShowPopover(!showPopover);
              }}
            >
              ...
            </p>
            {isOther && showPopover && index === clickedIndex && <Popover2 />}
            {!isOther && showPopover && index === clickedIndex && <Popover />}
          </div>
        </div>

        <p className="font-normal  text-[18px] mb-[18px] leading-[26.16px] text-brand-text">
          {post?.body}
        </p>

        {post?.media && (
          <div className="relative mb-[100px] rounded-[4px] overflow-hidden flex justify-center">
            <>
              {post?.file_type === "VIDEO" ? (
                <video src={post?.media} controls />
              ) : (
                <Image
                  src={post?.media}
                  alt="post img"
                  onError={handleMediaPostError}
                />
              )}
            </>
            <div
              className={`rounded-[4px] h-[30px] flex justify-center items-center absolute ${
                post?.post_type === "VIDEO"
                  ? "bottom-[60px]"
                  : "bottom-[21.75px]"
              } bg-brand-1500 left-[15px] py-[4px] px-[10px] text-[11px] leading-[16px] font-semibold text-brand-500`}
            >
              {post?.post_type}
            </div>
          </div>
        )}

        <div className="h-[78px] w-full absolute bottom-0  px-[19px] border -mx-[22px] border-b-0 border-x-0 border-t-1 border-brand-2500 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="flex gap-x-[3px] mb-[5px]">
              <NextImage src="/heart.svg" width="15" height="15" alt="heart" />
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
          <div
            className="flex flex-col items-center"
            onClick={() => setShowShareModal(true)}
          >
            <div className="flex gap-x-[3px] mb-[5px]">
              <NextImage src="/arrow2.svg" width="15" height="15" alt="arrow" />
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

      {showShareModal && (
        <ShareModal post={post} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
};

export default SinglePostCard;
