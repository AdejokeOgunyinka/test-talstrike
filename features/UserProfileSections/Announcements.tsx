/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { useGetMyProfile, useGetPostsByType } from "@/api/profile";
import SingleAnnouncementCard from "@/components/SinglePostTypeCards/SingleAnnouncementCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";

const MyAnnouncements = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();
  const { id } = router.query;

  const { ref, inView } = useInView();
  const {
    data: userPosts,
    isLoading: isLoadingUserPosts,
    hasNextPage,
    fetchNextPage,
  } = useGetPostsByType({
    token: TOKEN as string,
    userId: id as string,
    post_type: "ANNOUNCEMENT",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

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

      <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
        {isLoadingUserPosts ? (
          Array(2)
            ?.fill("")
            ?.map((_, index) => (
              <LoadingPosts key={index} width={"w-100% md:w-[45%]"} />
            ))
        ) : userPosts?.pages?.flat(1)?.length === 0 ||
          !userPosts?.pages?.flat(1) ? (
          <p>No announcement available at the moment...</p>
        ) : (
          userPosts?.pages
            ?.flat(1)
            ?.map((post: any, index: number) => (
              <SingleAnnouncementCard
                key={index}
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

      {!isLoadingUserPosts && hasNextPage && (
        <div
          ref={ref}
          className="flex w-full justify-center items-center mt-[30px]"
        >
          <button className="flex justify-center items-center w-[188px] h-[47px] bg-brand-600 text-brand-500">
            Loading More...
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAnnouncements;
