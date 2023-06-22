/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetPostsByType } from "@/api/profile";
import CreateOpening from "@/components/ProfileModals/CreateOpening";
import DeletePost from "@/components/ProfileModals/DeletePost";
import EditOpening from "@/components/ProfileModals/EditOpening";
import SingleOpening from "@/components/SingleProfilePostComponent/SingleOpening";
import SingleOpeningCard from "@/components/SinglePostTypeCards/SingleOpeningCard";

const MyOpenings = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const [page, setPage] = useState(1);

  const { data: userPosts, isLoading: isLoadingUserPosts } = useGetPostsByType({
    token: TOKEN as string,
    userId: USER_ID as string,
    post_type: "OPENING",
    page: page,
  });

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

  return (
    <div className="mt-[21px] w-full">
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

      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          My Openings
        </h3>
        <button
          onClick={() => setOpenCreateOpeningModal(!openCreateOpeningModal)}
          className="bg-brand-600  w-[142px] h-[41px] rounded-[19px] font-semibold text-[12px] leading-[18px] text-brand-500"
        >
          Create Opening
        </button>
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
          ) : userPosts?.results?.length === 0 || !userPosts?.results ? (
            <p>No opening available at the moment...</p>
          ) : (
            userPosts?.results?.map((post: any, index: number) => (
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
                setShowSingleOpening={setShowSingleOpening}
              />
            ))
          )}
        </div>
      )}

      {!isLoadingUserPosts &&
        userPosts?.results?.length > 0 &&
        !showSingleOpening && (
          <div className="flex justify-between items-center w-full mt-[20px]">
            <div>
              {userPosts?.current_page > 1 && (
                <ArrowLeftCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    if (page === 1) {
                      setPage(1);
                    } else {
                      setPage(page - 1);
                    }
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
            <div className="flex gap-[20px] items-center">
              <div className="border border-brand-600 w-[55px] rounded-[5px] flex justify-end pr-[10px]">
                {page}
              </div>
              {userPosts?.current_page < userPosts?.total_pages && (
                <ArrowRightCircleIcon
                  color="#0074D9"
                  height="30px"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        )}

      {/* {!isLoadingUserPosts &&
        userPosts?.results &&
        userPosts?.results?.length !== 0 && (
          <div className="mt-[45px] w-full flex justify-center items-center">
            <button className="w-[146px] bg-brand-600 h-[41px] rounded-[19px] text-brand-500 text-[14px] leading-[21px]">
              Load More
            </button>
          </div>
        )} */}
    </div>
  );
};

export default MyOpenings;
