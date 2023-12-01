import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NextImage from "next/image";
import moment from "moment";
import styled from "styled-components";

import { handleOnError } from "@/libs/utils";
import { ActivePoll, InactivePoll } from "@/features/ProfileSections/Polls";
import { useState } from "react";
import ShareModal from "../ShareModal";

const Image = styled.img``;

const SinglePollCard = ({
  post,
  setClickedIndex,
  setChosenPost,
  setShowPopover,
  showPopover,
  index,
  clickedIndex,
}: {
  post: any;
  setClickedIndex: any;
  setChosenPost: any;
  setShowPopover: any;
  showPopover: boolean;
  index: number;
  clickedIndex: number;
}) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] py-[10px] px-[15px] flex flex-col gap-y-[7px]">
        <p
          onClick={() =>
            router.push({
              pathname: `/posts/${post?.id}`,
              query: { type: "poll" },
            })
          }
          className="text-brand-600 text-[10px] font-medium leading-[15px] cursor-pointer"
        >
          View Poll
        </p>
      </div>
    );
  };

  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div className="relative rounded-[8px] bg-brand-500 shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] basis-[100%] md:basis-[48%] pt-[21px] px-[23px] w-full md:w-[45%] min-h-[250px]">
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

        <div className="relative mb-[53px] pb-[78px] rounded-[4px] overflow-hidden w-[full] mt-[20px]">
          {post?.voted ||
          post?.author?.id === session?.user?.id ||
          moment(
            moment(new Date(post?.created_at)).add(
              parseInt(post?.duration?.split(" ")[0]),
              "days"
            )
          ).diff(new Date(), "hours") < 1 ? (
            <InactivePoll options={post?.poll_choices} />
          ) : (
            <ActivePoll
              options={post?.poll_choices}
              token={TOKEN as string}
              pollId={post?.id}
            />
          )}
        </div>

        <div className="absolute bottom-[78px] w-[88%] flex mb-[12px] items-center justify-between text-[14px] text-brand-2250">
          <div className="w-[33%]">
            <b className="font-semibold">{post?.total_vote_count}</b> vote
            {post?.total_vote_count > 1 && "s"}
          </div>
          <div className="w-[33%] flex justify-center border border-t-transparent border-b-transparent border-l-brand-2750 border-r-brand-2750">
            {parseInt(post?.duration?.split(" ")[0]) > 0 && (
              <>
                <b className="font-semibold">{post?.duration?.split(" ")[0]}</b>{" "}
                day{post?.duration?.split(" ")[0] > 1 && "s"}
              </>
            )}
          </div>
          <div className="w-[33%] flex justify-center break-word px-[20px]">
            {moment(
              moment(new Date(post?.created_at)).add(
                parseInt(post?.duration?.split(" ")[0]),
                "days"
              )
            ).diff(new Date(), "hours") > 0 &&
            moment(
              moment(new Date(post?.created_at)).add(
                parseInt(post?.duration?.split(" ")[0]),
                "days"
              )
            ).diff(new Date(), "hours") < 24
              ? "Ongoing"
              : moment(
                  moment(new Date(post?.created_at)).add(
                    parseInt(post?.duration?.split(" ")[0]),
                    "days"
                  )
                ).diff(new Date(), "hours") > 24
              ? moment(
                  moment(new Date(post?.created_at)).add(
                    parseInt(post?.duration?.split(" ")[0]),
                    "days"
                  )
                ).diff(new Date(), "days") +
                ` day${
                  moment(
                    moment(new Date(post?.created_at)).add(
                      parseInt(post?.duration?.split(" ")[0]),
                      "days"
                    )
                  ).diff(new Date(), "days") > 1
                    ? "s"
                    : ""
                } remaining`
              : "Final result"}
          </div>
        </div>

        <div className="h-[78px] absolute bottom-0 w-full px-[19px] border -mx-[22px] border-b-0 border-x-0 border-t-1 border-brand-2500 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="flex gap-x-[3px] mb-[5px]">
              <NextImage src="/heart.svg" width="15" height="15" alt="heart" />
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

export default SinglePollCard;
