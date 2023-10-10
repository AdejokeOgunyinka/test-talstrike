import ArrowForwardIcon from "@/assets/svgFiles/ArrowForward.svg.next";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { useGetAllCoaches } from "@/api/coaches";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import PeopleComponent from "@/components/Messaging/PeopleComponent";
import MessagingFriendComponent, {
  IMessagingFriendComponent,
} from "@/components/Messaging/MessagingFriendComponent";

const MessagingSidebar = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.access;

  const { data: Coaches, isLoading: isLoadingCoaches } = useGetAllCoaches({
    token: TOKEN as string,
  });

  const MessagingUserList: IMessagingFriendComponent[] = [
    {
      name: "Eleanor Pena",
      time: "10:25 AM",
      img: "https://images.unsplash.com/photo-1680392383212-da9f0012fff8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2827&q=80",
      numberOfUnreadMessages: 4,
      currentlyTyping: true,
      messageStatus: "unread",
      userStatus: "online",
      id: "1",
    },
    {
      name: "Jenny Wilson",
      time: "4:43 AM",
      img: "https://plus.unsplash.com/premium_photo-1694618623840-e72540d60389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
      lastMessage: "If we so can, tomorrow",
      userStatus: "offline",
      id: "2",
    },
    {
      name: "Jenny Wilson",
      time: "4:43 AM",
      img: "https://plus.unsplash.com/premium_photo-1694618623840-e72540d60389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
      lastMessage: "If we so can, tomorrow",
      userStatus: "offline",
      id: "3",
    },
    {
      name: "Jenny Wilson",
      time: "4:43 AM",
      img: "https://plus.unsplash.com/premium_photo-1694618623840-e72540d60389?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
      lastMessage: "If we so can, tomorrow",
      messageStatus: "pending",
      userStatus: "offline",
      id: "4",
    },
    {
      name: "Eleanor Pena",
      time: "10:25 AM",
      img: "https://images.unsplash.com/photo-1680392383212-da9f0012fff8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2827&q=80",
      numberOfUnreadMessages: 4,
      currentlyTyping: true,
      messageStatus: "unread",
      userStatus: "online",
      id: "5",
    },
  ];

  return (
    <Box w="100%" pt="15px">
      <Flex
        justify="space-between"
        align="center"
        borderBottom="1px solid"
        borderColor="stroke"
        padding="14px 14.998px 15px 23px"
      >
        <Text color="dark-blue" fontSize="15px" fontWeight="500">
          Messaging
        </Text>
        <Flex align="center" gap="3px">
          <Box boxSize="3px" bg="secondary-blue" borderRadius="100%" />
          <Text color="secondary-blue" fontSize="11px" fontWeight="500">
            5 unreads
          </Text>
        </Flex>
      </Flex>
      <Box
        borderBottom="1px solid"
        borderColor="stroke"
        padding="17px 22px 16px 28px"
      >
        <Flex justify="space-between" color="grey-1" fontWeight="500" mb="14px">
          <Text fontSize="11px">People near me</Text>
          <Flex align="center" cursor="pointer">
            <Text fontSize="10px" mr="5px">
              {" "}
              VIEW ALL
            </Text>
            <ArrowForwardIcon fill="#93A3B1" />
          </Flex>
        </Flex>

        <Flex overflowX="scroll" className="scrollbar-hidden" gap="14px">
          {isLoadingCoaches ? (
            <div className="flex justify-between gap-x-[5px]">
              {Array(4)
                ?.fill("")
                ?.map((_, index) => (
                  <SkeletonTheme
                    key={index}
                    baseColor="#D7DEE1"
                    highlightColor="#fff"
                  >
                    <Skeleton
                      height={55}
                      width={55}
                      style={{ borderRadius: "100%" }}
                    />
                  </SkeletonTheme>
                ))}
            </div>
          ) : Coaches?.pages?.flat(1)?.length === 0 || !Coaches ? (
            <p className="text-[13px]">No coach at the moment...</p>
          ) : (
            Coaches?.pages
              ?.flat(1)
              ?.slice(0, 5)
              ?.map((coach: any, index: number) => (
                <PeopleComponent
                  key={index}
                  img={coach?.user?.image}
                  name={coach?.user?.firstname}
                  id={coach?.user?.id}
                />
              ))
          )}
        </Flex>
      </Box>
      <Box
        padding="17px 25px"
        className="h-[calc(85vh-200px)] scrollbar-hidden"
        overflowY="scroll"
      >
        <Box mb="24px">
          <Flex
            justify="space-between"
            color="grey-1"
            fontWeight="500"
            mb="14px"
          >
            <Text fontSize="11px">Friends</Text>
            <Flex align="center" cursor="pointer">
              <Text fontSize="10px" mr="5px">
                {" "}
                VIEW ALL
              </Text>
              <ArrowForwardIcon fill="#93A3B1" />
            </Flex>
          </Flex>

          <Flex overflowX="scroll" className="scrollbar-hidden" gap="14px">
            {isLoadingCoaches ? (
              <div className="flex justify-between gap-x-[5px]">
                {Array(4)
                  ?.fill("")
                  ?.map((_, index) => (
                    <SkeletonTheme
                      key={index}
                      baseColor="#D7DEE1"
                      highlightColor="#fff"
                    >
                      <Skeleton
                        height={55}
                        width={55}
                        style={{ borderRadius: "100%" }}
                      />
                    </SkeletonTheme>
                  ))}
              </div>
            ) : Coaches?.pages?.flat(1)?.length === 0 || !Coaches ? (
              <p className="text-[13px]">No coach at the moment...</p>
            ) : (
              Coaches?.pages
                ?.flat(1)
                ?.slice(0, 5)
                ?.map((coach: any, index: number) => (
                  <PeopleComponent
                    key={index}
                    img={coach?.user?.image}
                    name={coach?.user?.firstname}
                    id={coach?.user?.id}
                  />
                ))
            )}
          </Flex>
        </Box>

        <Flex direction="column" gap="20px">
          {MessagingUserList?.map((message, index) => (
            <MessagingFriendComponent
              key={index}
              img={message?.img}
              id={message?.id}
              name={message?.name}
              time={message?.time}
              messageStatus={message?.messageStatus}
              lastMessage={message?.lastMessage}
              numberOfUnreadMessages={message?.numberOfUnreadMessages}
              userStatus={message?.userStatus}
              currentlyTyping={message?.currentlyTyping}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default MessagingSidebar;
