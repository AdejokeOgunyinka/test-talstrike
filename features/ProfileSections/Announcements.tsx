/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";

import { useGetPostsByType } from "@/api/profile";
import CreateAnnouncements from "@/components/ProfileModals/CreateAnnouncement";
import DeletePost from "@/components/ProfileModals/DeletePost";
import EditAnnouncement from "@/components/ProfileModals/EditAnnouncement";
import SingleAnnouncement from "@/components/SingleProfilePostComponent/SingleAnnouncement";
import SingleAnnouncementCard from "@/components/SinglePostTypeCards/SingleAnnouncementCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";

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

  return (
    <div className="mt-[21px] w-full">
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

      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          My Announcements
        </h3>
        <button
          onClick={() =>
            setOpenCreateAnnouncementModal(!openCreateAnnouncementModal)
          }
          className="bg-brand-600  w-[214px] h-[41px] rounded-[19px] font-semibold text-[12px] leading-[18px] text-brand-500"
        >
          Create Announcement
        </button>
      </div>

      {showSingleAnnouncement === true ? (
        <SingleAnnouncement chosenPost={chosenPost} />
      ) : (
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
                  handleClickDelete={handleClickDelete}
                  handleClickEditModal={handleClickEditModal}
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

export default MyAnnouncements;
