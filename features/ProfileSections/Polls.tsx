/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetPollsByUserId, useVotePollChoice } from "@/api/profile";
import { useEffect, useState } from "react";
import PollRadioBtn from "@/components/PollRadioBtn";
import PollProgressBar from "@/components/PollProgressBar";
import CreatePoll from "@/components/ProfileModals/CreatePoll";
import notify from "@/libs/toast";
import SinglePoll from "@/components/SingleProfilePostComponent/SinglePoll";
import SinglePollCard from "@/components/SinglePostTypeCards/SinglePollCard";

const MyPolls = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const [page, setPage] = useState(1);
  const { data: userPolls, isLoading: isLoadingUserPosts } =
    useGetPollsByUserId({
      token: TOKEN as string,
      userId: USER_ID as string,
      page: page,
    });

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [chosenPost, setChosenPost] = useState<any>(null);
  const [showSinglePoll, setShowSinglePoll] = useState(false);

  const [openCreatePollModal, setOpenCreatePollModal] = useState(false);

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
      {openCreatePollModal && (
        <CreatePoll onClose={() => setOpenCreatePollModal(false)} />
      )}
      <div className="flex justify-between mb-[32px] bg-brand-500 py-[20px] px-[35px]">
        <h3 className="text-brand-600 font-semibold text-[21.25px] leading-[32px]">
          My Polls
        </h3>
        <button
          onClick={() => setOpenCreatePollModal(!openCreatePollModal)}
          className="bg-brand-600  w-[142px] h-[41px] rounded-[19px] font-semibold text-[12px] leading-[18px] text-brand-500"
        >
          Create Poll
        </button>
      </div>

      {showSinglePoll === true ? (
        <SinglePoll
          setShowSinglePoll={setShowSinglePoll}
          seconds={seconds}
          chosenPost={chosenPost}
        />
      ) : (
        <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
          {isLoadingUserPosts ? (
            <SkeletonLoader />
          ) : userPolls?.results?.length === 0 || !userPolls?.results ? (
            <p>No poll available at the moment...</p>
          ) : (
            userPolls?.results?.map((post: any, index: number) => (
              <SinglePollCard
                key={index}
                post={post}
                setClickedIndex={setClickedIndex}
                setChosenPost={setChosenPost}
                setShowPopover={setShowPopover}
                showPopover={showPopover}
                index={index}
                clickedIndex={clickedIndex}
                setShowSinglePoll={setShowSinglePoll}
              />
            ))
          )}
        </div>
      )}

      {!isLoadingUserPosts &&
        userPolls?.results?.length > 0 &&
        !showSinglePoll && (
          <div className="flex justify-between items-center w-full mt-[20px]">
            <div>
              {userPolls?.current_page > 1 && (
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
              {userPolls?.current_page < userPolls?.total_pages && (
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
        userPolls?.results &&
        userPolls?.results?.length !== 0 && (
          <div className="mt-[45px] w-full flex justify-center items-center">
            <button className="w-[146px] bg-brand-600 h-[41px] rounded-[19px] text-brand-500 text-[14px] leading-[21px]">
              Load More
            </button>
          </div>
        )} */}
    </div>
  );
};

export const ActivePoll = ({
  options,
  token,
  pollId,
}: {
  options: any;
  token: string;
  pollId: string;
}) => {
  const [selected, setSelected] = useState("");
  const [chosenId, setChosenId] = useState("");

  const { mutate: votePoll } = useVotePollChoice();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (chosenId) {
      votePoll(
        {
          data: { voter_choice: chosenId },
          pollId: pollId,
          token: token,
        },
        {
          onSuccess() {
            notify({ type: "success", text: "Your vote was successful" });
            queryClient.invalidateQueries(["getPollsByUserId"]);
            queryClient.invalidateQueries(["getPolls"]);
            setChosenId("");
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenId]);

  return (
    <div className="flex flex-col gap-y-[14px] w-full">
      {options?.map((option: any, index: number) => (
        <PollRadioBtn
          name={option?.choice_text}
          value={option?.choice_text}
          key={index}
          selected={selected}
          onChange={() => {
            setSelected(option?.choice_text);
            setChosenId(option?.choice_id);
          }}
        />
      ))}
    </div>
  );
};

export const InactivePoll = ({ options }: { options: any }) => {
  const getHighest = () => {
    const values = options?.map((option: any) => parseInt(option?.percentage));
    const highest = Math.max(...values);
    return options?.findIndex(
      (option: any) => parseInt(option?.percentage) == highest
    );
  };

  return (
    <div className="flex flex-col w-full gap-y-[14px]">
      {options?.map((option: any, index: number) => (
        <PollProgressBar
          bgColor="bg-[#D7EAFB]"
          key={index}
          completed={option?.percentage?.toFixed(1)}
          option={option?.choice_text}
          special={index === getHighest()}
        />
      ))}
    </div>
  );
};

export default MyPolls;
