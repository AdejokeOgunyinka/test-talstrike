/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useGetPostsByType } from "@/api/profile";
import CreateOpening from "@/components/ProfileModals/CreateOpening";
import DeletePost from "@/components/ProfileModals/DeletePost";
import EditOpening from "@/components/ProfileModals/EditOpening";
import SingleOpeningCard from "@/components/SinglePostTypeCards/SingleOpeningCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";
import NoOpeningSvgIcon from "@/assets/svgFiles/NoOpeningSvg";

const MyOpenings = () => {
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
    post_type: "OPENING",
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

  const [showSingleOpening, setShowSingleOpening] = useState(false);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSingleOpening) {
    setInterval(incrementSeconds, 1000);
  }

  const [openCreateOpeningModal, setOpenCreateOpeningModal] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  const router = useRouter();

  return (
    <div className="w-full">
      {showEditModal && (
        <EditOpening onClose={() => setShowEditModal(false)} id={postIndex} />
      )}
      {showDeleteModal && postIndex && (
        <DeletePost
          id={postIndex}
          postType={"Opening"}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {openCreateOpeningModal && (
        <CreateOpening onClose={() => setOpenCreateOpeningModal(false)} />
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
            My Openings
          </Text>
        </Flex>
        <Button
          bg="#293137"
          color="#fff"
          onClick={() => setOpenCreateOpeningModal(!openCreateOpeningModal)}
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
            <div className="w-full h-[50vh] flex flex-col gap-[11px] justify-center items-center">
              <NoOpeningSvgIcon />
              <Text
                fontSize="24px"
                fontWeight="600"
                lineHeight="186.5%"
                color="#293137"
              >
                No Opening
              </Text>
              <Text
                color="#93A3B1"
                fontSize="18px"
                fontWeight="400"
                lineHeight="186.5%"
                w="60%"
                textAlign="center"
              >
                You have not published any opening yet. Openings you create and
                publish will show up here.
              </Text>
            </div>
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
                  handleClickDeleteModal={handleClickDelete}
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

export default MyOpenings;
