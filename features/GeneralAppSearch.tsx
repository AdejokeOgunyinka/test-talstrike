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
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

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

export const PersonSearchResultComponent = ({
  firstname,
  lastname,
  userId,
  img,
  roles,
  location,
  isFollowing,
  sport,
}: {
  firstname: string;
  lastname: string;
  userId: string;
  img: string;
  sport?: string;
  roles: string[];
  location?: string[];
  isFollowing?: boolean;
}) => {
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
      <Flex align="center" className="w-[calc(100%-88px)]">
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
              src={img || "/user_placeholder.svg"}
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
              href={`/profile/${userId}`}
              cursor="pointer"
              _hover={{ textDecoration: "none" }}
              fontSize="13px"
              noOfLines={1}
              textOverflow="ellipsis"
            >
              {firstname} {lastname}
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
            {roles}
            {`${sport && sport !== null ? ", " : ""}`}
            {
              sports?.results?.filter(
                (sportResult: any) => sportResult?.id === sport
              )[0]?.name
            }
          </Text>
          <Flex
            gap={location && location !== null ? "10px" : "unset"}
            align="center"
            color="grey-1"
            fontSize="11px"
            fontWeight="500"
          >
            <Text>
              {location && location !== null
                ? `${location[1]}, ${location[0]}`
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
                userId: userId,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries(["getSuggestedFollows"]);
                  queryClient.invalidateQueries(["getSearchValues"]);
                  queryClient.invalidateQueries(["getMyFollowers"]);
                  queryClient.invalidateQueries(["getPeopleNearMe"]);
                  notify({
                    type: "success",
                    text: `You are ${!isFollowing && "now"} ${
                      isFollowing ? "unfollowing" : "following"
                    } ${firstname} ${lastname}`,
                  });
                },
              }
            );
          }}
          isLoading={isFollowingPlayer}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button
          borderRadius="4px"
          border="1px solid"
          borderColor="text"
          w="68px"
          h="29px"
          fontSize="11px"
          color="text"
          bg="primary-white-3"
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
    <Box pb="60px">
      {showSinglePost === true ? (
        <SinglePost chosenPost={chosenPost} />
      ) : showSinglePoll ? (
        <SinglePoll chosenPost={chosenPost} />
      ) : (
        <Tabs>
          <TabList>
            <Tab fontSize="14px" fontWeight="500">
              People
            </Tab>
            <Tab fontSize="14px" fontWeight="500">
              Posts
            </Tab>
            <Tab fontSize="14px" fontWeight="500">
              Videos
            </Tab>
            <Tab fontSize="14px" fontWeight="500">
              Latest
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel padding={"unset"} paddingTop="14px">
              {searchData?.people?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No person found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <Flex gap="9px" flexWrap={"wrap"}>
                  {searchData?.people?.map((person: any, index: number) => (
                    <Box width={{ base: "100%", md: "calc(50% - 9px)" }}>
                      <PersonSearchResultComponent
                        firstname={person?.user?.firstname}
                        lastname={person?.user?.lastname}
                        userId={person?.user?.id}
                        sport={person?.sport}
                        location={person?.location}
                        img={person?.user?.image}
                        roles={person?.user?.roles[0]}
                        isFollowing={person?.is_following}
                        key={index}
                      />
                    </Box>
                  ))}
                </Flex>
              )}
            </TabPanel>
            <TabPanel padding={"unset"} paddingTop="14px">
              {searchData?.posts?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No post found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 1150: 2 }}
                >
                  <Masonry
                    columnsCount={2}
                    style={{ gap: "9px" }}
                    className="masonry"
                  >
                    {searchData?.posts?.map((post: any, index: number) =>
                      post?.question_text ? (
                        <PollCard
                          key={index}
                          post={post}
                          index={index}
                          setShowPopover={setShowPopover}
                          setClickedIndex={setClickedIndex}
                          setPollIndex={setPollIndex}
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
                        />
                      )
                    )}
                  </Masonry>
                </ResponsiveMasonry>
              )}
            </TabPanel>
            <TabPanel padding={"unset"} paddingTop="14px">
              {searchData?.videos?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No video found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <Flex gap="9px" width="100%" flexWrap="wrap">
                  {searchData?.videos?.map((video: any, index: number) => (
                    <Box width={{ base: "100%", md: "calc(50% - 9px)" }}>
                      <ExploreCard
                        key={index}
                        index={index}
                        post={video}
                        exploreCardWidth="100%"
                      />
                    </Box>
                  ))}
                </Flex>
              )}
            </TabPanel>
            <TabPanel padding={"unset"} paddingTop="14px">
              {searchData?.latest?.length === 0 ? (
                <Flex w="full" h="70vh" align="center" justify="center">
                  <Text>No latest found with query: {search_query}!</Text>
                </Flex>
              ) : (
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
                  <Masonry
                    columnsCount={2}
                    style={{ gap: "9px" }}
                    className="masonry"
                  >
                    {searchData?.latest?.map((latest: any, index: number) =>
                      latest?.question_text ? (
                        <PollCard
                          key={index}
                          post={latest}
                          index={index}
                          setShowPopover={setShowPopover}
                          setClickedIndex={setClickedIndex}
                          setPollIndex={setPollIndex}
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
                        />
                      )
                    )}
                  </Masonry>
                </ResponsiveMasonry>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default GeneralAppSearch;
