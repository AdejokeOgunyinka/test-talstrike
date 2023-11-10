/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { useGetMyProfile, useGetPollsByUserId } from "@/api/profile";
import SinglePollCard from "@/components/SinglePostTypeCards/SinglePollCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";

const MyPolls = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const router = useRouter();
  const { id } = router.query;

  const { ref, inView } = useInView();
  const {
    data: userPolls,
    isLoading: isLoadingUserPosts,
    hasNextPage,
    fetchNextPage,
  } = useGetPollsByUserId({
    token: TOKEN as string,
    userId: id as string,
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
  const [showSinglePoll, setShowSinglePoll] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSinglePoll) {
    setInterval(incrementSeconds, 1000);
  }

  return (
    <div className="mt-[21px] w-full">
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          {`${userProfile?.user?.firstname}'s`} Polls
        </h3>
      </div>

      <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
        {isLoadingUserPosts ? (
          Array(2)
            ?.fill("")
            ?.map((_, index) => (
              <LoadingPosts key={index} width={"w-100% md:w-[45%]"} />
            ))
        ) : userPolls?.pages?.flat(1)?.length === 0 ||
          !userPolls?.pages?.flat(1) ? (
          <p>No poll available at the moment...</p>
        ) : (
          userPolls?.pages
            ?.flat(1)
            ?.map((post: any, index: number) => (
              <SinglePollCard
                key={index}
                post={post}
                setClickedIndex={setClickedIndex}
                setChosenPost={setChosenPost}
                setShowPopover={setShowPopover}
                showPopover={showPopover}
                index={index}
                clickedIndex={clickedIndex}
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

export default MyPolls;
