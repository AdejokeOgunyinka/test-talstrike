import NextImage from "next/image";
import { useSession } from "next-auth/react";
import moment from "moment";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetMyProfile, useGetPostsByType } from "@/api/profile";

const Image = styled.img``;

const MyAnnouncements = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();
  const { id } = router.query;

  const { data: userPosts, isLoading: isLoadingUserPosts } = useGetPostsByType({
    token: TOKEN as string,
    userId: id as string,
    post_type: "ANNOUNCEMENT",
  });

  const { data: userProfile } = useGetMyProfile({
    token: TOKEN as string,
    userId: id as string,
  });

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [postIndex, setPostIndex] = useState("");

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[150px] py-[20px] px-[17px] flex flex-col gap-y-[6px]">
        <p className="text-brand-600 text-[10px] font-medium leading-[15px]">
          View Announcement
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
      <div className="flex justify-between mb-[32px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          {`${userProfile?.user?.firstname}'s`} Announcements
        </h3>
      </div>

      <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
        {isLoadingUserPosts ? (
          <SkeletonLoader />
        ) : userPosts?.results?.length === 0 || !userPosts?.results ? (
          <p>No announcement available at the moment...</p>
        ) : (
          userPosts?.results?.map((post: any, index: number) => (
            <div
              key={index}
              className="relative rounded-[8px] bg-brand-500 shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] basis-[100%] md:basis-[48%] pt-[21px] px-[23px] w-full md:w-[45%]"
            >
              <div className="flex items-center justify-between mb-[25px]">
                <div className="flex items-center">
                  <div className="mr-[7px] rounded-[100%] w-[39px] h-[39px] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]">
                    <NextImage
                      src={post?.author?.image}
                      alt="post creator"
                      width="39"
                      height="39"
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
                      setShowPopover(!showPopover);
                    }}
                  >
                    ...
                  </p>
                  {showPopover && clickedIndex === index && <Popover />}
                </div>
              </div>

              <p className="text-brand-1750 mb-[5px] text-[14px] font-semibold leading-[21px]">
                {post?.title}
              </p>
              <p className="font-normal  text-[10px] mb-[14px] leading-[15px] text-brand-50">
                {post?.body}
              </p>

              <div className="relative mb-[100px] rounded-[4px] overflow-hidden flex justify-center">
                {post?.media && (
                  <>
                    {post?.file_type === "VIDEO" ? (
                      <video src={post?.media} controls />
                    ) : (
                      <Image src={post?.media} alt="post img" />
                    )}
                  </>
                )}
              </div>

              <div className="h-[78px] absolute bottom-0 w-full bg-brand-500  px-[19px] border -mx-[22px] border-b-0 border-x-0 border-t-1 border-brand-2500 flex items-center justify-between">
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

export default MyAnnouncements;
