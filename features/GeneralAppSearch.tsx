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
} from "@chakra-ui/react";
import PostCard from "@/components/PostCard";
import ExploreCard from "@/components/ExploreCard";
import { handleOnError } from "@/libs/utils";
import { useGetSports } from "@/api/auth";

const GeneralAppSearch = ({ searchData }: { searchData: any }) => {
  const { data: sports } = useGetSports();

  return (
    <Box>
      <Tabs>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Videos</Tab>
          <Tab>People</Tab>
          <Tab>Latest</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {searchData?.posts?.map((post: any, index: number) => (
              <PostCard
                key={index}
                postType={post?.post_type}
                postImage={post?.author?.image}
                postAuthor={
                  post
                    ? `${post?.author?.firstname} ${post?.author?.lastname}`
                    : ""
                }
                timeCreated={post?.created_at}
                postBody={post?.body}
                postMedia={post?.media}
                postLikedAvatars={post?.liked_avatars}
                postLikeCount={post?.like_count}
                postCommentCount={post?.comment_count}
                postShareCount={post?.share_count}
                postId={post?.id}
                liked={post?.liked}
                isLoadingPost={false}
                postTitle={post?.title}
                fileType={post?.file_type}
                post={post}
                onClickViewPost={() => {}}
              />
            ))}
          </TabPanel>
          <TabPanel>
            <Flex direction="column" gap="12px">
              {searchData?.videos?.map((video: any, index: number) => (
                <ExploreCard key={index} index={index} post={video} />
              ))}
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex direction="column" gap="10px">
              {searchData?.people?.map((person: any, index: number) => (
                <Flex
                  key={index}
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
                      <Text fontSize="13px">
                        {person?.user?.firstname} {person?.user?.lastname}
                      </Text>
                      <Box
                        w="6px"
                        h="6px"
                        bg="blue-green"
                        borderRadius="100%"
                        ml="15px"
                      ></Box>
                    </Flex>
                    <Text
                      color="secondary-blue"
                      fontSize="11px"
                      fontWeight="500"
                    >
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
                    >
                      Follow
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
              ))}
            </Flex>
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GeneralAppSearch;
