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
import { useSession } from "next-auth/react";
import PostCard from "@/components/PostCard";
import { useGetNewsfeed } from "@/api/dashboard";

const GeneralAppSearch = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const {
    data: NewsFeedData,
    isLoading: isLoadingNewsFeed,
    hasNextPage: hasNextNewsFeedPage,
    fetchNextPage: fetchNextNewsFeedPage,
  } = useGetNewsfeed({
    token: TOKEN as string,
  });

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
            <PostCard
              postType={
                NewsFeedData && (NewsFeedData as any)?.pages[0][0]?.post_type
              }
              postImage={
                NewsFeedData &&
                (NewsFeedData as any)?.pages[0][0]?.author?.image
              }
              postAuthor={
                NewsFeedData
                  ? `${(NewsFeedData as any)?.pages[0][0]?.author?.firstname} ${
                      (NewsFeedData as any)?.pages[0][0]?.author?.lastname
                    }`
                  : ""
              }
              timeCreated={
                NewsFeedData && (NewsFeedData as any)?.pages[0][0]?.created_at
              }
              postBody={
                NewsFeedData && (NewsFeedData as any)?.pages[0][0]?.body
              }
              postMedia={
                NewsFeedData && (NewsFeedData as any)?.pages[0][0]?.media
              }
              postLikedAvatars={
                NewsFeedData &&
                (NewsFeedData as any)?.pages[0][0]?.liked_avatars
              }
              postLikeCount={
                NewsFeedData && (NewsFeedData as any)?.pages[0][0]?.like_count
              }
              postCommentCount={
                NewsFeedData &&
                (NewsFeedData as any)?.pages[0][0]?.comment_count
              }
              postShareCount={
                NewsFeedData && (NewsFeedData as any)?.pages[0][0]?.share_count
              }
              postId={NewsFeedData && (NewsFeedData as any)[0]?.id}
              liked={NewsFeedData && (NewsFeedData as any)[0]?.liked}
              isLoadingPost={isLoadingNewsFeed}
              postTitle={NewsFeedData && (NewsFeedData as any)[0]?.title}
              fileType={NewsFeedData && (NewsFeedData as any)[0]?.file_type}
              post={NewsFeedData && (NewsFeedData as any)?.pages[0][0]}
              onClickViewPost={() => {}}
            />
          </TabPanel>
          <TabPanel></TabPanel>
          <TabPanel>
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
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRec0ykhkRuTEK4ItrlLAgAOnsUFKzu_NIejqqJc-4&s`}
                    alt="avatar"
                    w="full"
                    h="full"
                    borderRadius={"43.797px"}
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
                  <Text fontSize="13px">Jack Chukwuma</Text>
                  <Box
                    w="6px"
                    h="6px"
                    bg="blue-green"
                    borderRadius="100%"
                    ml="15px"
                  ></Box>
                </Flex>
                <Text color="secondary-blue" fontSize="11px" fontWeight="500">
                  Talent, Football
                </Text>
                <Flex
                  gap="10px"
                  align="center"
                  color="grey-1"
                  fontSize="11px"
                  fontWeight="500"
                >
                  <Text>Lagos, Nigeria</Text>
                  <Box w="3px" h="3px" bg="grey-1" borderRadius="100%"></Box>
                  <Text>15 miles away</Text>
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
          </TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GeneralAppSearch;
