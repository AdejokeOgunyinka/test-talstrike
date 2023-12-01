/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useGetPostsByType } from "@/api/profile";
import CreateAnnouncements from "@/components/ProfileModals/CreateAnnouncement";
import DeletePost from "@/components/ProfileModals/DeletePost";
import EditAnnouncement from "@/components/ProfileModals/EditAnnouncement";
import SingleAnnouncementCard from "@/components/SinglePostTypeCards/SingleAnnouncementCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";
import NoAnnouncementSvgIcon from "@/assets/svgFiles/NoAnnouncementSvg";

const MyAnnouncements = () => {
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
    post_type: "ANNOUNCEMENT",
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

  const [showSingleAnnouncement, setShowSingleAnnouncement] = useState(false);

  const [openCreateAnnouncementModal, setOpenCreateAnnouncementModal] =
    useState(false);

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

  const router = useRouter();

  return (
    <div className="w-full">
      {showEditModal && (
        <EditAnnouncement
          onClose={() => setShowEditModal(false)}
          id={postIndex}
        />
      )}
      {showDeleteModal && postIndex && (
        <DeletePost
          id={postIndex}
          postType={"Announcement"}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {openCreateAnnouncementModal && (
        <CreateAnnouncements
          onClose={() => setOpenCreateAnnouncementModal(false)}
        />
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
            My Announcements
          </Text>
        </Flex>
        <Button
          bg="#293137"
          color="#fff"
          onClick={() =>
            setOpenCreateAnnouncementModal(!openCreateAnnouncementModal)
          }
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
              <NoAnnouncementSvgIcon />
              <Text
                fontSize="24px"
                fontWeight="600"
                lineHeight="186.5%"
                color="#293137"
              >
                No Announcement
              </Text>
              <Text
                color="#93A3B1"
                fontSize="18px"
                fontWeight="400"
                lineHeight="186.5%"
                w="60%"
                textAlign="center"
              >
                You have not published any announcement yet. Announcements you
                create and publish will show up here.
              </Text>
            </div>
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

export default MyAnnouncements;
