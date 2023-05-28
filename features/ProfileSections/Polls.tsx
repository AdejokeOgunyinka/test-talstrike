import NextImage from "next/image";
import { useSession } from "next-auth/react";
import moment from "moment";

import SkeletonLoader from "@/components/SkeletonLoader";
import { useGetPollsByUserId, useVotePollChoice } from "@/api/profile";
import { useEffect, useState } from "react";
import PollRadioBtn from "@/components/PollRadioBtn";
import PollProgressBar from "@/components/PollProgressBar";
import CreatePoll from "@/components/ProfileModals/CreatePoll";
import { handleOnError } from "@/libs/utils";
import notify from "@/libs/toast";

const MyPolls = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;
  const USER_IMG = session?.user?.image;
  const USER_NAME = `${session?.user?.firstname} ${session?.user?.lastname}`;

  const { data: userPolls, isLoading: isLoadingUserPosts } =
    useGetPollsByUserId({
      token: TOKEN as string,
      userId: USER_ID as string,
    });

  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(1);

  const [pollIndex, setPollIndex] = useState("");

  // const [showDeleteModal, setShowDeleteModal] = useState(false);

  const Popover = () => {
    return (
      <div className="absolute top-[16px] rounded-[4px] backdrop-blur-[7.5px] shadow shadow-[5px_19px_25px_-1px rgba(0, 0, 0, 0.15)] bg-brand-whitish z-[55] border border-[0.5px] border-brand-1950 right-[0] w-[94px] h-[42px] py-[15px] px-[15px] flex flex-col gap-y-[7px]">
        <p className="text-brand-600 text-[10px] font-medium leading-[15px]">
          View Poll
        </p>

        {/* <p className="text-brand-2600 text-[10px] font-medium leading-[15px]">
          Delete Poll
        </p> */}
      </div>
    );
  };

  const [openCreatePollModal, setOpenCreatePollModal] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowPopover(false);
    });
  }, []);

  return (
    <div className="mt-[21px] w-full">
      {openCreatePollModal && (
        <CreatePoll onClose={() => setOpenCreatePollModal(false)} />
      )}
      <div className="flex justify-between mb-[32px]">
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

      <div className="flex flex-col flex-wrap md:flex-row gap-x-[23px] gap-y-[15px] w-full">
        {isLoadingUserPosts ? (
          <SkeletonLoader />
        ) : userPolls?.results?.length === 0 || !userPolls?.results ? (
          <p>No poll available at the moment...</p>
        ) : (
          userPolls?.results?.map((post: any, index: number) => (
            <div
              key={index}
              className="rounded-[8px] bg-brand-500 shadow shadow-[0px_5.2951px_14.8263px_rgba(0, 0, 0, 0.09)] basis-[100%] md:basis-[48%] pt-[21px] px-[23px] w-full md:w-[45%]"
            >
              <div className="flex items-center justify-between mb-[35px]">
                <div className="flex items-center">
                  <div className="mr-[7px] rounded-[100%] w-[39px] h-[39px] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]">
                    <NextImage
                      src={USER_IMG as string}
                      alt="post creator"
                      width="39"
                      height="39"
                      className="mr-[7px] object-cover rounded-[100%] w-[39px] h-[39px] border-[2.11px] border-brand-500 shadow shadow-[0px_4.23608px_10.5902px_4.23608px_rgba(0, 0, 0, 0.07)]"
                      onError={handleOnError}
                    />
                  </div>

                  <div>
                    <p className="mb-[3px] font-semibold text-[11px] leading-[16px] text-brand-2250">
                      {USER_NAME}
                    </p>
                    <p className="font-medium text-[10px] leading-[15px] text-brand-2450">
                      {moment(post?.created_at).format("dddd Do MMMM")}
                    </p>
                  </div>
                </div>
                <div
                  className="cursor-pointer relative"
                  onClick={(e) => e?.stopPropagation()}
                >
                  <p
                    className="text-brand-2250 text-[27.7px] leading-[0px] pb-[10px] font-semibold"
                    onClick={() => {
                      setClickedIndex(index);
                      setPollIndex(post?.id);
                      setShowPopover(!showPopover);
                    }}
                  >
                    ...
                  </p>
                  {showPopover && clickedIndex === index && <Popover />}
                </div>
              </div>

              <p className="text-brand-1750 mb-[9px] text-[14px] font-semibold leading-[21px]">
                {post?.question_text}
              </p>

              <p className="font-normal  text-[10px] mb-[35px] leading-[15px] text-brand-50">
                {post?.body}
              </p>

              <div className="relative mb-[33px] rounded-[4px] overflow-hidden w-[full]">
                <ActivePoll
                  options={post?.poll_choices}
                  token={TOKEN as string}
                  pollId={post?.id}
                />
              </div>

              <div className="flex mb-[12px] justify-between w-full text-[14px] text-brand-2250">
                <div>
                  <b className="font-semibold">50</b> votes
                </div>
                <div className="border border-t-transparent border-b-transparent border-l-brand-2750 border-r-brand-2750 px-[40px]">
                  <b className="font-semibold">2</b> weeks
                </div>
                <div>
                  {index + 1 === 1
                    ? "Ongoing"
                    : index + 1 === 2
                    ? "Final result"
                    : "Ongoing"}
                </div>
              </div>

              <div className="h-[78px] px-[19px] border -mx-[22px] border-b-0 border-x-0 border-t-1 border-brand-2500 flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="flex gap-x-[3px] mb-[5px]">
                    <NextImage
                      src="/heart.svg"
                      width="15"
                      height="15"
                      alt="heart"
                    />
                    <p className="text-brand-2250 font-medium text-[13px]">
                      {post?.like_count}
                    </p>
                  </div>
                  <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                    Likes
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-x-[3px] mb-[5px]">
                    <NextImage
                      src="/chatbox2.svg"
                      width="15"
                      height="15"
                      alt="chatbox"
                    />
                    <p className="text-brand-2250 font-medium text-[13px]">
                      {post?.comment_count}
                    </p>
                  </div>
                  <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                    Comments
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-x-[3px] mb-[5px]">
                    <NextImage
                      src="/arrow2.svg"
                      width="15"
                      height="15"
                      alt="arrow"
                    />
                    <p className="text-brand-2250 font-medium text-[13px]">
                      {post?.share_count}
                    </p>
                  </div>
                  <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">
                    Shares
                  </p>
                </div>
                {/* <div className="flex flex-col items-center">
                  <div className="flex gap-x-[3px] mb-[5px]">
                    <NextImage src="/barChart.svg" width="15px" height="15px" />
                    <p className="text-brand-2250 font-medium text-[13px]">26</p>
                  </div>
                  <p className="text-brand-2550 text-[9px] font-medium leading-[14px]">Views</p>
                </div> */}
              </div>
            </div>
          ))
        )}
      </div>

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

const ActivePoll = ({
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
            setChosenId("");
          },
        }
      );
    }
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

const InactivePoll = ({ options }: { options: any }) => {
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
          bgColor="bg-brand-2700"
          key={index}
          completed={option?.percentage}
          option={option?.value}
          special={index === getHighest()}
        />
      ))}
    </div>
  );
};

export default MyPolls;
