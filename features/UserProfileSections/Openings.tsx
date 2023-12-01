/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Flex, Text, Image } from "@chakra-ui/react";

import { useGetMyProfile, useGetPostsByType } from "@/api/profile";
import SingleOpeningCard from "@/components/SinglePostTypeCards/SingleOpeningCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";

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
    <div className="w-full">
      <Flex
        border="1px solid"
        borderColor="#CDCDCD"
        width="full"
        justify="space-between"
        align="center"
        p="9px 19px"
        marginTop="17px"
      >
        <Flex gap="15px" align="center">
          <Image
            src="/arrow-back.svg"
            alt="arrow back"
            onClick={() => router.back()}
          />
          <Text fontWeight="600" lineHeight="30.03px" fontSize="22px">
            {`${userProfile?.user?.firstname}'s`} Openings
          </Text>
        </Flex>
      </Flex>

      <div className="w-full pl-[31px] pr-[26px] pt-[16px]">
        <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
          {isLoadingUserPosts ? (
            Array(2)
              ?.fill("")
              ?.map((_, index) => (
                <LoadingPosts key={index} width={"w-100% md:w-[45%]"} />
              ))
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
    </div>
  );
};

export default MyOpenings;
