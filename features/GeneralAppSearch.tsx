import { useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Flex,
  Image,
  Text,
  Button,
  Link,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

import PostCard from "@/components/PostCard";
import PollCard from "@/components/PollCard";
import ExploreCard from "@/components/ExploreCard";
import SinglePost from "@/components/SingleProfilePostComponent/SinglePost";
import SinglePoll from "@/components/SingleProfilePostComponent/SinglePoll";
import { handleOnError } from "@/libs/utils";
import { useGetSports } from "@/api/auth";
import { useFollowUser } from "@/api/players";
import { useTypedSelector } from "@/hooks/hooks";
import notify from "@/libs/toast";

const PersonSearchResultComponent = ({ person }: { person: any }) => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const queryClient = useQueryClient();
  const { data: sports } = useGetSports();
  const { mutate: followUser, isLoading: isFollowingPlayer } = useFollowUser();
  return (
    <Flex
      pr="15px"
      pl="20px"
      py="18px"
      border="1px solid"
      borderColor="stroke"
      borderRadius="8px"
      pos="relative"
    >
      <Box mr="10.3px">
        <Box
          w="43.797px"
          h="42.543px"
          borderRadius="43.797px"
          border="2px solid"
          borderColor="stroke"
          mb="9px"
        >
          <Image
            src={`${person?.user?.image}`}
            alt="avatar"
            w="full"
            h="full"
            borderRadius={"43.797px"}
            onError={handleOnError}
          />
        </Box>
        <Flex
          w="39.056px"
          h="19px"
          bg="blue-green"
          color="primary-white-3"
          justify="center"
          align="center"
          fontSize="10px"
          fontWeight="600"
          borderRadius="10.314px"
        >
          4.3M
        </Flex>
      </Box>
      <Flex direction="column" gap="11px">
        <Flex align="center">
          <Link
            href={`/profile/${person?.user?.id}`}
            cursor="pointer"
            _hover={{ textDecoration: "none" }}
            fontSize="13px"
          >
            {person?.user?.firstname} {person?.user?.lastname}
          </Link>
          <Box
            w="6px"
            h="6px"
            bg="blue-green"
            borderRadius="100%"
            ml="15px"
          ></Box>
        </Flex>
        <Text color="secondary-blue" fontSize="11px" fontWeight="500">
          {person?.user?.roles[0]}
          {`${person?.sport !== null ? ", " : ""}`}
          {
            sports?.results?.filter(
              (sport: any) => sport?.id === person?.sport
            )[0]?.name
          }
        </Text>
        <Flex
          gap={person?.location !== null ? "10px" : "unset"}
          align="center"
          color="grey-1"
          fontSize="11px"
          fontWeight="500"
        >
          <Text>
            {person?.location !== null
              ? `${person?.location[1]}, ${person?.location[0]}`
              : ""}
          </Text>
          {/* {person?.location !== null && (
                        <Box
                          w="3px"
                          h="3px"
                          bg="grey-1"
                          borderRadius="100%"
                        ></Box>
                      )} */}
          {/* <Text>15 miles away</Text> */}
        </Flex>
      </Flex>

      <Flex
        h="full"
        direction="column"
        pos="absolute"
        align="center"
        justify="center"
        right="0"
        top="0"
        mr="15px"
        gap="15px"
        fontSize="11px"
      >
        <Button
          w="68px"
          h="29px"
          bg="light-blue"
          color="primary-white-3"
          borderRadius="4px"
          fontSize="11px"
          onClick={() => {
            followUser(
              {
                token: TOKEN as string,
                userId: person?.user?.id,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries(["getSuggestedFollows"]);
                  queryClient.invalidateQueries(["getSearchValues"]);
                  notify({
                    type: "success",
                    text: `You are ${!person?.is_following && "now"} ${
                      person?.is_following ? "unfollowing" : "following"
                    } ${person?.user?.firstname} ${person?.user?.lastname}`,
                  });
                },
              }
            );
          }}
          isLoading={isFollowingPlayer}
        >
          {person?.is_following ? "Unfollow" : "Follow"}
        </Button>
        <Button
          borderRadius="4px"
          border="1px solid"
          borderColor="text"
          w="68px"
          h="29px"
          fontSize="11px"
          color="text"
        >
          Chat
        </Button>
      </Flex>
    </Flex>
  );
};
const GeneralAppSearch = ({ searchData }: { searchData: any }) => {
  const { search_query } = useTypedSelector((state) => state.dashboard);

  const [showSinglePost, setShowSinglePost] = useState(false);
  const [showSinglePoll, setShowSinglePoll] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(0);
  const [, setPollIndex] = useState("");
  const [chosenPost, setChosenPost] = useState<any>(null);

  let seconds = 0;
  function incrementSeconds() {
    seconds += 1;
  }

  if (showSinglePoll || showSinglePost) {
    setInterval(incrementSeconds, 1000);
  }

  return (
    <Box>
      {showSinglePost === true ? (
        <SinglePost
          setShowSinglePost={setShowSinglePost}
          seconds={seconds}
          chosenPost={chosenPost}
        />
      ) : showSinglePoll ? (
        <SinglePoll
          setShowSinglePoll={setShowSinglePoll}
          seconds={seconds}
          chosenPost={chosenPost}
        />
      ) : (
        <Tabs>
          <TabList>
            <Tab fontSize="14px" fontWeight="500">
              Posts
            </Tab>
            <Tab fontSize="14px" fontWeight="500">
              Videos
            </Tab>
            <Tab fontSize="14px" fontWeight="500">
              People
            </Tab>
            <Tab fontSize="14px" fontWeight="500">
              Latest
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {searchData?.posts?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No post found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <Flex direction="column" gap="10px">
                  {searchData?.posts?.map((post: any, index: number) =>
                    post?.question_text ? (
                      <PollCard
                        key={index}
                        post={post}
                        index={index}
                        setShowSinglePoll={setShowSinglePoll}
                        setShowPopover={setShowPopover}
                        setClickedIndex={setClickedIndex}
                        setPollIndex={setPollIndex}
                        setChosenPost={setChosenPost}
                        showPopover={showPopover}
                        clickedIndex={clickedIndex}
                      />
                    ) : (
                      <PostCard
                        postType={post?.post_type}
                        postImage={post?.author?.image}
                        postAuthor={`${post?.author?.firstname} ${post?.author?.lastname}`}
                        timeCreated={post?.created_at}
                        postBody={post?.body}
                        postMedia={post?.media}
                        postLikedAvatars={post.liked_avatars}
                        postLikeCount={post?.like_count}
                        postCommentCount={post?.comment_count}
                        postShareCount={post?.share_count}
                        postId={post?.id}
                        liked={post?.liked}
                        key={index}
                        isLoadingPost={false}
                        postTitle={post?.title}
                        fileType={post?.file_type}
                        post={post}
                        onClickViewPost={() => {
                          setShowSinglePost(true);
                          setChosenPost(post);
                        }}
                      />
                    )
                  )}
                </Flex>
              )}
            </TabPanel>
            <TabPanel>
              {searchData?.videos?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No video found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <Flex direction="column" gap="12px" width="100%">
                  {searchData?.videos?.map((video: any, index: number) => (
                    <ExploreCard
                      key={index}
                      index={index}
                      post={video}
                      exploreCardWidth="100%"
                    />
                  ))}
                </Flex>
              )}
            </TabPanel>
            <TabPanel>
              {searchData?.people?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No person found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <Flex direction="column" gap="10px">
                  {searchData?.people?.map((person: any, index: number) => (
                    <PersonSearchResultComponent person={person} key={index} />
                  ))}
                </Flex>
              )}
            </TabPanel>
            <TabPanel>
              {searchData?.latest?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No latest found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <Flex direction="column" gap="10px">
                  {searchData?.latest?.map((latest: any, index: number) =>
                    latest?.question_text ? (
                      <PollCard
                        key={index}
                        post={latest}
                        index={index}
                        setShowSinglePoll={setShowSinglePoll}
                        setShowPopover={setShowPopover}
                        setClickedIndex={setClickedIndex}
                        setPollIndex={setPollIndex}
                        setChosenPost={setChosenPost}
                        showPopover={showPopover}
                        clickedIndex={clickedIndex}
                      />
                    ) : (
                      <PostCard
                        key={index}
                        postType={latest?.post_type}
                        postImage={latest?.author?.image}
                        postAuthor={
                          latest
                            ? `${latest?.author?.firstname} ${latest?.author?.lastname}`
                            : ""
                        }
                        timeCreated={latest?.created_at}
                        postBody={latest?.body}
                        postMedia={latest?.media}
                        postLikedAvatars={latest?.liked_avatars}
                        postLikeCount={latest?.like_count}
                        postCommentCount={latest?.comment_count}
                        postShareCount={latest?.share_count}
                        postId={latest?.id}
                        liked={latest?.liked}
                        isLoadingPost={false}
                        postTitle={latest?.title}
                        fileType={latest?.file_type}
                        post={latest}
                        onClickViewPost={() => {
                          setShowSinglePost(true);
                          setChosenPost(latest);
                        }}
                      />
                    )
                  )}
                </Flex>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default GeneralAppSearch;
