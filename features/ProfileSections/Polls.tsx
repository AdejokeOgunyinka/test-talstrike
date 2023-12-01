/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Flex, Text, Image, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useGetPollsByUserId, useVotePollChoice } from "@/api/profile";
import { useEffect, useState } from "react";
import PollRadioBtn from "@/components/PollRadioBtn";
import PollProgressBar from "@/components/PollProgressBar";
import CreatePoll from "@/components/ProfileModals/CreatePoll";
import notify from "@/libs/toast";
import SinglePollCard from "@/components/SinglePostTypeCards/SinglePollCard";
import LoadingPosts from "@/components/LoadingStates/loadingPost";
import NoPollSvgIcon from "@/assets/svgFiles/NoPollSvg";

const MyPolls = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;
  const USER_ID = session?.user?.id;

  const { ref, inView } = useInView();
  const {
    data: userPolls,
    isLoading: isLoadingUserPosts,
    hasNextPage,
    fetchNextPage,
  } = useGetPollsByUserId({
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

  const router = useRouter();

  return (
    <div className="w-full">
      {openCreatePollModal && (
        <CreatePoll onClose={() => setOpenCreatePollModal(false)} />
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
            My Polls
          </Text>
        </Flex>
        <Button
          bg="#293137"
          color="#fff"
          onClick={() => setOpenCreatePollModal(!openCreatePollModal)}
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
          ) : userPolls?.pages?.flat(1)?.length === 0 ||
            !userPolls?.pages?.flat(1) ? (
            <div className="w-full h-[50vh] flex flex-col gap-[11px] justify-center items-center">
              <NoPollSvgIcon />
              <Text
                fontSize="24px"
                fontWeight="600"
                lineHeight="186.5%"
                color="#293137"
              >
                No Poll
              </Text>
              <Text
                color="#93A3B1"
                fontSize="18px"
                fontWeight="400"
                lineHeight="186.5%"
                w="60%"
                textAlign="center"
              >
                You have not published any poll yet. Polls you create and
                publish will show up here.
              </Text>
            </div>
          ) : (
            userPolls?.pages
              ?.flat(1)
              ?.map((post: any, index: number) => (
                <SinglePollCard
                  key={index}
                  post={post}
                  setClickedIndex={setClickedIndex}
                  setChosenPost={setChosenPost}
                  setShowPopover={setShowPopover}
                  showPopover={showPopover}
                  index={index}
                  clickedIndex={clickedIndex}
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
