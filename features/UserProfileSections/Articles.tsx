/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { Flex, Text, Image } from "@chakra-ui/react";

import { useGetMyProfile, useGetPostsByType } from "@/api/profile";
import SingleArticleCard from "@/components/SinglePostTypeCards/SingleArticleCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";
import NoArticleSvgIcon from "@/assets/svgFiles/NoArticleSvg";

const MyArticles = () => {
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
    post_type: "ARTICLE",
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
  const [showSingleArticle, setShowSingleArticle] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSingleArticle) {
    setInterval(incrementSeconds, 1000);
  }

  const [, setPostIndex] = useState("");

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
            {`${userProfile?.user?.firstname}'s`} Articles
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
            <div className="w-full h-[50vh] flex flex-col gap-[11px] justify-center items-center">
              <NoArticleSvgIcon />
              <Text
                fontSize="24px"
                fontWeight="600"
                lineHeight="186.5%"
                color="#293137"
              >
                No Article
              </Text>
              <Text
                color="#93A3B1"
                fontSize="18px"
                fontWeight="400"
                lineHeight="186.5%"
                w="60%"
                textAlign="center"
              >
                You have not published any article yet. Articles you create and
                publish will show up here.
              </Text>
            </div>
          ) : (
            userPosts?.pages
              ?.flat(1)
              ?.map((post: any, index: number) => (
                <SingleArticleCard
                  key={index}
                  post={post}
                  setClickedIndex={setClickedIndex}
                  setChosenPost={setChosenPost}
                  setShowPopover={setShowPopover}
                  setPostIndex={setPostIndex}
                  index={index}
                  showPopover={showPopover}
                  clickedIndex={clickedIndex}
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

export default MyArticles;
