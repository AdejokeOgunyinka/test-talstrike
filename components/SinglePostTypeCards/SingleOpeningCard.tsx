import NextImage from "next/image";
import moment from "moment";
import styled from "styled-components";

import { handleOnError } from "@/libs/utils";
import { useState } from "react";
import ShareModal from "../ShareModal";

const Image = styled.img``;

const SingleOpeningCard = ({
  post,
  index,
  clickedIndex,
  setClickedIndex,
  setPostIndex,
  setShowPopover,
  showPopover,
  setChosenPost,
  handleClickDeleteModal,
  handleClickEditModal,
  setShowSingleOpening,
  isOther,
}: {
  post: any;
  index: number;
  clickedIndex: number;
  isOther?: boolean;
  setClickedIndex: any;
  setPostIndex: any;
  setShowPopover: any;
  setChosenPost: any;
  showPopover: boolean;
  setShowSingleOpening: any;
  handleClickEditModal?: any;
  handleClickDeleteModal?: any;
}) => {
  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[113px] h-[83px] py-[14px] px-[17px] flex flex-col gap-y-[6px]">
        <p
          onClick={() => {
            setShowSingleOpening(true);
            setShowPopover(false);
          }}
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
        >
          View Opening
        </p>
        {/* <p className="text-brand-600 text-[10px] font-medium leading-[15px]">View Insight</p> */}
        <p
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
          onClick={handleClickEditModal}
        >
          Edit Opening
        </p>
        <p
          className="text-brand-2600 text-[10px] font-medium leading-[15px]"
          onClick={handleClickDeleteModal}
        >
          Delete Opening
        </p>
      </div>
    );
  };
  const Popover2 = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[113px] py-[10px] px-[15px] flex flex-col gap-y-[6px]">
        <p
          onClick={() => {
            setShowSingleOpening(true);
            setShowPopover(false);
          }}
          className="text-brand-600 text-[10px] font-medium leading-[15px]"
        >
          View Opening
        </p>
      </div>
    );
  };

  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <>
      <div className="rounded-[8px] relative bg-brand-500 shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] basis-[100%] md:basis-[48%] pt-[21px] px-[23px] w-full md:w-[45%] min-h-[250px]">
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
            {showPopover && !isOther && clickedIndex === index && <Popover />}
            {showPopover && isOther && clickedIndex === index && <Popover2 />}
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
              post?.post_type === "VIDEO" ? "bottom-[60px]" : "bottom-[21.75px]"
            } bg-brand-2650 left-[15px] py-[4px] px-[10px] text-[11px] leading-[16px] font-semibold text-brand-600`}
          >
            Opening
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

export default SingleOpeningCard;
