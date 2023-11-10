/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";

import { useGetPosts } from "@/api/profile";
import CreatePost from "@/components/ProfileModals/CreatePost";
import DeletePost from "@/components/ProfileModals/DeletePost";
import EditPost from "@/components/ProfileModals/EditPost";
import SinglePost from "@/components/SingleProfilePostComponent/SinglePost";
import SinglePostCard from "@/components/SinglePostTypeCards/SinglePostCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";

const MyPosts = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const { ref, inView } = useInView();

  const {
    data: userPosts,
    isLoading: isLoadingUserPosts,
    fetchNextPage,
    hasNextPage,
  } = useGetPosts({
    token: TOKEN as string,
    userId: USER_ID as string,
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

  const [showSinglePost, setShowSinglePost] = useState(false);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);

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
      {showEditModal && (
        <EditPost id={postIndex} onClose={() => setShowEditModal(false)} />
      )}
      {showDeleteModal && postIndex && (
        <DeletePost
          id={postIndex}
          postType={"Post"}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {openCreatePostModal && (
        <CreatePost onClose={() => setOpenCreatePostModal(false)} />
      )}
      <div className="flex justify-between items-center mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          My Posts
        </h3>
        <button
          onClick={() => setOpenCreatePostModal(!openCreatePostModal)}
          className="bg-brand-600  w-[142px] h-[41px] rounded-[19px] font-semibold text-[12px] leading-[18px] text-brand-500"
        >
          Create Post
        </button>
      </div>

      {showSinglePost === true ? (
        <SinglePost chosenPost={chosenPost} />
      ) : (
        <div className="w-full">
          <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
            {isLoadingUserPosts ? (
              Array(2)
                ?.fill("")
                ?.map((_, index) => (
                  <LoadingPosts key={index} width={"w-100% md:w-[45%]"} />
                ))
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
                    setShowDeleteModal={setShowDeleteModal}
                    setShowEditModal={setShowEditModal}
                    setPostIndex={setPostIndex}
                    setChosenPost={setChosenPost}
                    setClickedIndex={setClickedIndex}
                    showSinglePost={false}
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
      )}
    </div>
  );
};

export default MyPosts;
