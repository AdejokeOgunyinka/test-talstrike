/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetMyProfile, useGetPostsByType } from "@/api/profile";
import SingleOpening from "@/components/SingleProfilePostComponent/SingleOpening";
import SingleOpeningCard from "@/components/SinglePostTypeCards/SingleOpeningCard";

const MyOpenings = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();
  const { id } = router.query;

  const { ref, inView } = useInView();
  const {
    data: userPosts,
    isLoading: isLoadingUserPosts,
    fetchNextPage,
    hasNextPage,
  } = useGetPostsByType({
    token: TOKEN as string,
    userId: id as string,
    post_type: "OPENING",
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
  const [showSingleOpening, setShowSingleOpening] = useState(false);

  const [, setPostIndex] = useState("");

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSingleOpening) {
    setInterval(incrementSeconds, 1000);
  }

  return (
    <div className="mt-[21px] w-full">
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          {`${userProfile?.user?.firstname}'s`} Openings
        </h3>
      </div>

      {showSingleOpening === true ? (
        <SingleOpening
          setShowSingleOpening={setShowSingleOpening}
          chosenPost={chosenPost}
          seconds={seconds}
        />
      ) : (
        <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
          {isLoadingUserPosts ? (
            <SkeletonLoader />
          ) : userPosts?.pages?.flat(1)?.length === 0 ||
            !userPosts?.pages?.flat(1) ? (
            <p>No opening available at the moment...</p>
          ) : (
            userPosts?.pages
              ?.flat(1)
              ?.map((post: any, index: number) => (
                <SingleOpeningCard
                  key={index}
                  index={index}
                  post={post}
                  clickedIndex={clickedIndex}
                  setClickedIndex={setClickedIndex}
                  setPostIndex={setPostIndex}
                  setShowPopover={setShowPopover}
                  showPopover={showPopover}
                  setChosenPost={setChosenPost}
                  setShowSingleOpening={setShowSingleOpening}
                  isOther={true}
                />
              ))
          )}
        </div>
      )}

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

export default MyOpenings;
