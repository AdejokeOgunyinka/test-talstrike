/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useGetPostsByType } from "@/api/profile";
import CreateArticle from "@/components/ProfileModals/CreateArticle";
import DeletePost from "@/components/ProfileModals/DeletePost";
import EditArticle from "@/components/ProfileModals/EditArticle";
import SingleArticleCard from "@/components/SinglePostTypeCards/SingleArticleCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";

const MyArticles = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const { ref, inView } = useInView();
  const {
    data: userPosts,
    isLoading: isLoadingUserPosts,
    hasNextPage,
    fetchNextPage,
  } = useGetPostsByType({
    token: TOKEN as string,
    userId: USER_ID as string,
    post_type: "ARTICLE",
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [postIndex, setPostIndex] = useState("");
  const [chosenPost, setChosenPost] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleClickDelete = () => {
    setShowDeleteModal(true);
    setShowPopover(false);
  };

  const handleClickEditModal = () => {
    setShowEditModal(true);
    setShowPopover(false);
  };

  const [showSingleArticle, setShowSingleArticle] = useState(false);

  const [openCreateArticleModal, setOpenCreateArticleModal] = useState(false);

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

  const router = useRouter();

  return (
    <div className="mt-[21px] w-full">
      {showEditModal && (
        <EditArticle onClose={() => setShowEditModal(false)} id={postIndex} />
      )}
      {showDeleteModal && postIndex && (
        <DeletePost
          id={postIndex}
          postType={"Article"}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {openCreateArticleModal && (
        <CreateArticle onClose={() => setOpenCreateArticleModal(false)} />
      )}

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
            My Articles
          </Text>
        </Flex>
        <Button
          bg="#293137"
          color="#fff"
          onClick={() => setOpenCreateArticleModal(!openCreateArticleModal)}
        >
          Add New
        </Button>
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
            <p>No article available at the moment...</p>
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
                  handleClickDelete={handleClickDelete}
                  handleClickEditModal={handleClickEditModal}
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
