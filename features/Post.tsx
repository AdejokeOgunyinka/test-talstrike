import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useGetSinglePost, useGetSinglePoll } from "@/api/profile";
import SinglePoll from "@/components/SingleProfilePostComponent/SinglePoll";
import SinglePost from "@/components/SingleProfilePostComponent/SinglePost";
import SingleAnnouncement from "@/components/SingleProfilePostComponent/SingleAnnouncement";
import SingleOpening from "@/components/SingleProfilePostComponent/SingleOpening";
import SingleArticle from "@/components/SingleProfilePostComponent/SingleArticle";
import LoadingPosts from "@/components/LoadingStates/loadingPost";

const PostPage = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { query } = useRouter();

  const { data: singlePost, isLoading } =
    query?.type === "poll"
      ? useGetSinglePoll({
          token: TOKEN as string,
          pollId: query?.id as string,
        })
      : useGetSinglePost({
          token: TOKEN as string,
          postId: query?.id as string,
        });

  const PostComponentByType: Record<string, React.ReactNode> = {
    poll: <SinglePoll chosenPost={singlePost} />,
    post: <SinglePost chosenPost={singlePost} />,
    announcement: <SingleAnnouncement chosenPost={singlePost} />,
    opening: <SingleOpening chosenPost={singlePost} />,
    article: <SingleArticle chosenPost={singlePost} />,
  };

  return (
    <Box width="full">
      {isLoading
        ? Array(6)
            ?.fill("")
            ?.map((_, index) => <LoadingPosts key={index} />)
        : PostComponentByType[query?.type as string]}
    </Box>
  );
};

export default PostPage;
