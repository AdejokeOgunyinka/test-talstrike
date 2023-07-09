/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetMyProfile, useGetPosts } from "@/api/profile";
import SinglePost from "@/components/SingleProfilePostComponent/SinglePost";
import SinglePostCard from "@/components/SinglePostTypeCards/SinglePostCard";

const MyPosts = () => {
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
  } = useGetPosts({
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
  const [, setPostIndex] = useState("");

  const [showSinglePost, setShowSinglePost] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSinglePost) {
    setInterval(incrementSeconds, 1000);
  }

  return (
    <div className="mt-[21px] w-full">
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          {`${userProfile?.user?.firstname}'s`} Posts
        </h3>
      </div>

      {showSinglePost === true ? (
        <SinglePost
          setShowSinglePost={setShowSinglePost}
          seconds={seconds}
          chosenPost={chosenPost}
        />
      ) : (
        <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
          {isLoadingUserPosts ? (
            <SkeletonLoader />
          ) : userPosts?.pages?.flat(1)?.length === 0 ||
            !userPosts?.pages?.flat(1) ? (
            <p>No post available at the moment...</p>
          ) : (
            userPosts?.pages
              ?.flat(1)
              ?.map((post: any, index: number) => (
                <SinglePostCard
                  key={index}
                  index={index}
                  clickedIndex={clickedIndex}
                  post={post}
                  setShowPopover={setShowPopover}
                  setShowSinglePost={setShowSinglePost}
                  showPopover={showPopover}
                  setChosenPost={setChosenPost}
                  setClickedIndex={setClickedIndex}
                  showSinglePost={false}
                  setPostIndex={setPostIndex}
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

export default MyPosts;
