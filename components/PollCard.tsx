/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Link } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useRouter } from "next/router";

import HeartIcon from "@/assets/heartIcon.svg";
import HeartIconFilled from "@/assets/heartIconDashboard.svg";
import { handleOnError, uppercaseFirsLetter } from "@/libs/utils";
import { ActivePoll, InactivePoll } from "@/features/ProfileSections/Polls";
import { axios } from "@/libs/axios";
import notify from "@/libs/toast";
import ShareModal from "./ShareModal";
import DeletePost from "./ProfileModals/DeletePost";

const Image = styled.img``;

const PollCard = ({
  post,
  index,
  setShowPopover,
  setClickedIndex,
  setPollIndex,
  showPopover,
  clickedIndex,
}: {
  post: any;
  index: number;
  setShowPopover: any;
  setClickedIndex: any;
  setPollIndex: any;
  showPopover: boolean;
  clickedIndex: number;
}) => {
  const { data: session } = useSession();

  const TOKEN = session?.user?.access;

  const [isLikingOrUnlikingPoll, setIsLikingOrUnlikingPoll] = useState(false);

  const queryClient = useQueryClient();

  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleClickDelete = () => {
    setShowDeleteModal(true);
    setShowPopover(false);
  };

  const Popover = () => {
    return (
      <div className="absolute w-max top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] py-[10px] px-[15px] flex flex-col gap-y-[7px]">
        <p
          onClick={() =>
            router.push({
              pathname: `/posts/${post?.id}`,
              query: { type: "poll" },
            })
          }
          className="text-brand-600 text-[10px] font-medium leading-[15px] cursor-pointer"
        >
          View
        </p>
        {post?.author?.id === session?.user?.id && (
          <>
            <p
              className="text-brand-600 text-[10px] font-medium leading-[15px] cursor-pointer"
              onClick={handleClickDelete}
            >
              Delete
            </p>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  return (
    <>
      <div className="w-full mb-[9px] rounded-[8px] bg-brand-500 border-[1.059px] border-[#CDCDCD] basis-[100%] md:basis-[48%] pt-[21px] px-[23px]">
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
                className="object-cover w-[42px] h-[42px] rounded-[50%] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                onError={handleOnError}
              />
            </div>

            <div>
              <Link
                href={`/profile/${post?.author?.id}`}
                cursor="pointer"
                _hover={{ textDecoration: "none" }}
                className="mb-[3px] font-semibold text-[11px] lg:text-[18px] text-[#293137]"
              >
                {post?.author?.firstname} {post?.author?.lastname}
              </Link>
              <p className="text-[#93A3B1] mt-[6px] font-medium text-[11px] lg:text-[15px]">
                {uppercaseFirsLetter(post?.author?.roles[0] as string)} |{" "}
                {moment(post?.created_at)?.format("dddd Do MMM")}
              </p>
            </div>
          </div>
          <div
            className="cursor-pointer relative"
            onClick={(e) => e?.stopPropagation()}
          >
            <p
              className="text-[#293137] font-semibold text-[31px] relative pb-[10px]"
              onClick={() => {
                setClickedIndex(index);
                setPollIndex(post?.id);
                setShowPopover(!showPopover);
              }}
            >
              ...
            </p>
            {showPopover && clickedIndex === index && <Popover />}
          </div>
        </div>

        <p className="mb-[9px] font-medium text-[#293137] text-[11px] lg:text-[18px] leading-[21px]">
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

        <div className="flex mb-[12px] justify-between w-full text-[14px] text-brand-2250">
          <div>
            <b className="font-semibold">{post?.total_vote_count}</b> vote
            {post?.total_vote_count > 1 && "s"}
          </div>
          <div className="border border-t-transparent border-b-transparent border-l-brand-2750 border-r-brand-2750 px-[40px]">
            {parseInt(post?.duration?.split(" ")[0]) > 0 && (
              <>
                <b className="font-semibold">{post?.duration?.split(" ")[0]}</b>{" "}
                day{post?.duration?.split(" ")[0] > 1 && "s"}
              </>
            )}
          </div>
          <div>
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

        <div className="flex -mx-[22px] justify-center gap-[30px] lg:gap-[80px] py-[13px]">
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
                  queryClient.invalidateQueries(["getNewsfeed"]);
                  queryClient.invalidateQueries(["getPolls"]);
                  queryClient.invalidateQueries(["getAllCommentsOnPost"]);
                  queryClient.invalidateQueries(["getMyPosts"]);
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
                    {post?.liked === true ? (
                      <NextImage src={HeartIconFilled} alt="heart-filled" />
                    ) : (
                      <NextImage src={HeartIcon} alt="heart" />
                    )}
                  </div>
                  <p
                    className={
                      "font-medium text-[20px] ml-[3px] " +
                      `${
                        post?.is_liked === true
                          ? "text-brand-love"
                          : "text-[#93A3B1]"
                      }`
                    }
                  >
                    {post?.like_count}
                  </p>
                </div>

                <p
                  className={
                    "text-[16px] font-medium leading-[14px] " +
                    `${
                      post?.is_liked === true
                        ? "text-brand-love"
                        : "text-[#93A3B1]"
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
            onClick={() =>
              router.push({
                pathname: `/posts/${post?.id}`,
                query: { type: "poll" },
              })
            }
          >
            <div className="flex gap-x-[3px] mb-[5px]">
              <NextImage
                src="/chatbox2.svg"
                width="26"
                height="23"
                alt="chatbox"
              />
              <p className="text-[#93A3B1] font-medium text-[20px]">
                {post?.comment_count}
              </p>
            </div>
            <p className="text-[#93A3B1] text-[16px] font-medium leading-[14px]">
              Comments
            </p>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <div
              className="flex gap-x-[3px] mb-[5px]"
              onClick={(e) => {
                e?.preventDefault();
                setShowShareModal(true);
              }}
            >
              <NextImage
                className="cursor-pointer"
                src="/arrow2.svg"
                width="26"
                height="23"
                alt="arrow"
              />
            </div>
            <p className="text-[#93A3B1] text-[16px] font-medium leading-[14px]">
              Shares
            </p>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal post={post} onClose={() => setShowShareModal(false)} />
      )}

      {showDeleteModal && (
        <DeletePost
          id={post?.id}
          postType={"Poll"}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default PollCard;
