/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetMyProfile, useGetPostsByType } from "@/api/profile";
import SingleAnnouncement from "@/components/SingleProfilePostComponent/SingleAnnouncement";
import SingleAnnouncementCard from "@/components/SinglePostTypeCards/SingleAnnouncementCard";

const MyAnnouncements = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();
  const { id } = router.query;

  const [page, setPage] = useState(1);
  const { data: userPosts, isLoading: isLoadingUserPosts } = useGetPostsByType({
    token: TOKEN as string,
    userId: id as string,
    post_type: "ANNOUNCEMENT",
    page: page,
  });

  const { data: userProfile } = useGetMyProfile({
    token: TOKEN as string,
    userId: id as string,
  });

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [chosenPost, setChosenPost] = useState<any>(null);
  const [showSingleAnnouncement, setShowSingleAnnouncement] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSingleAnnouncement) {
    setInterval(incrementSeconds, 1000);
  }

  const [, setPostIndex] = useState("");

  return (
    <div className="mt-[21px] w-full">
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          {`${userProfile?.user?.firstname}'s`} Announcements
        </h3>
      </div>

      {showSingleAnnouncement === true ? (
        <SingleAnnouncement
          setShowSingleAnnouncement={setShowSingleAnnouncement}
          seconds={seconds}
          chosenPost={chosenPost}
        />
      ) : (
        <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
          {isLoadingUserPosts ? (
            <SkeletonLoader />
          ) : userPosts?.results?.length === 0 || !userPosts?.results ? (
            <p>No announcement available at the moment...</p>
          ) : (
            userPosts?.results?.map((post: any, index: number) => (
              <SingleAnnouncementCard
                key={index}
                setShowSingleAnnouncement={setShowSingleAnnouncement}
                setShowPopover={setShowPopover}
                post={post}
                setClickedIndex={setClickedIndex}
                setPostIndex={setPostIndex}
                setChosenPost={setChosenPost}
                index={index}
                clickedIndex={clickedIndex}
                showPopover={showPopover}
                isOther={true}
              />
            ))
          )}
        </div>
      )}

      {!isLoadingUserPosts &&
        userPosts?.results?.length > 0 &&
        !showSingleAnnouncement && (
          <div className="flex justify-between items-center w-full mt-[20px]">
            <div>
              {userPosts?.current_page > 1 && (
                <ArrowLeftCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    if (page === 1) {
                      setPage(1);
                    } else {
                      setPage(page - 1);
                    }
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
            <div className="flex gap-[20px] items-center">
              <div className="border border-brand-600 w-[55px] rounded-[5px] flex justify-end pr-[10px]">
                {page}
              </div>
              {userPosts?.current_page < userPosts?.total_pages && (
                <ArrowRightCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        )}

      {/* {!isLoadingUserPosts &&
        userPosts?.results &&
        userPosts?.results?.length !== 0 && (
          <div className="mt-[45px] w-full flex justify-center items-center">
            <button className="w-[146px] bg-brand-600 h-[41px] rounded-[19px] text-brand-500 text-[14px] leading-[21px]">
              Load More
            </button>
          </div>
        )} */}
    </div>
  );
};

export default MyAnnouncements;
