import { Flex, Box, Text, Image, Input } from "@chakra-ui/react";
import MoreIconThreeDots from "@/assets/svgFiles/MoreIconThreeDots.svg.next";
import { useTypedSelector } from "@/hooks/hooks";
import CircleIcon from "@/assets/svgFiles/Circle.svg.next";
import SendMessageIcon from "@/assets/svgFiles/SendMessage.svg.next";
import MessageComponent from "./MessageComponent";
import SearchBar from "../SearchBar";

const UserSelected = () => {
  const { messageUserInfo } = useTypedSelector((state) => state.messaging);

  return (
    <Box w="full" h="full" pos="relative">
      <Flex
        w="full"
        justify="space-between"
        borderBottom="1px solid"
        borderColor="stroke"
        h="55px"
        align="center"
        pl="17px"
        pr="12px"
      >
        <Flex>
          <Image
            src={messageUserInfo?.img}
            alt="msg"
            boxShadow="0px 0px 12.02876px 0px rgba(0, 0, 0, 0.10)"
            borderRadius="37.155px"
            width="37.155px"
            height="37.012px"
            mr="6.02px"
          />
          <Box>
            <Text fontSize="13px" fontWeight="400" lineHeight="20px">
              {messageUserInfo?.name}
            </Text>
            <Flex
              align="center"
              color="grey-1"
              fontSize="9px"
              lineHeight="14px"
            >
              <CircleIcon
                fill={
                  messageUserInfo?.userStatus === "offline"
                    ? "#93A3B1"
                    : "#00B127"
                }
              />
              <Text ml="3.98px" mr="6px">
                {messageUserInfo?.userStatus}
              </Text>
              {messageUserInfo?.currentlyTyping && (
                <Text fontStyle="italic">Typing...</Text>
              )}
            </Flex>
          </Box>
          <Flex align="center" gap="12.64px" justify="center" ml="18.84px">
            <Image alt="videoCall" src="/videoCall.svg" cursor="pointer" />
            <Image alt="audioCall" src="/audioCall.svg" cursor="pointer" />
          </Flex>
        </Flex>
        <Flex h="35px" gap="28.05px" align="center">
          <SearchBar
            placeholder="Search here"
            hasRoundedCorners
            isLeftIcon
            iconColor="#93A3B1"
          />
          <MoreIconThreeDots cursor="pointer" />
        </Flex>
      </Flex>

      <Flex
        direction="column"
        gap="48px"
        className="h-[calc(88vh-55px)]"
        overflowY="scroll"
        padding={{ base: "18px 12px 120px 12px", md: "28px 18px 50px 18px" }}
      >
        <MessageComponent
          isSender
          userImg="https://images.unsplash.com/photo-1696513301944-90abb561b935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
          time="10:25 AM"
        >
          <Text color="primary-white-3" fontSize="16px">
            Professional!
          </Text>
        </MessageComponent>

        <MessageComponent
          userImg={messageUserInfo?.img}
          isReceiver
          time="10:30 AM"
          status="sent"
        >
          <Text>Yes it is </Text>
        </MessageComponent>

        <MessageComponent
          isSender
          userImg="https://images.unsplash.com/photo-1696513301944-90abb561b935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
          time="10:25 AM"
        >
          <Text color="primary-white-3" fontSize="16px">
            I am going to recommend her for an award!
          </Text>
        </MessageComponent>

        <MessageComponent
          userImg={messageUserInfo?.img}
          isReceiver
          time="10:30 AM"
          status="pending"
        >
          <Text>{`That's what I'm talking about`}</Text>
        </MessageComponent>

        <MessageComponent
          isSender
          userImg="https://images.unsplash.com/photo-1696513301944-90abb561b935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
          time="10:25 AM"
        >
          <Text color="primary-white-3" fontSize="16px">
            I am going to recommend her for an award!
          </Text>
        </MessageComponent>

        <MessageComponent
          userImg={messageUserInfo?.img}
          isReceiver
          time="10:30 AM"
          status="pending"
        >
          <Text>{`That's what I'm talking about`}</Text>
        </MessageComponent>
      </Flex>

      <Flex
        pos="absolute"
        bottom={{ base: "64px", md: "0" }}
        w="100%"
        justify="space-between"
        bg="text"
        padding={{ base: "16px", md: "16px 24px" }}
      >
        <Flex align="center">
          <Image alt="smile" src="/smile.svg" cursor="pointer" />
          <Image
            alt="attachment"
            src="/attachment.svg"
            cursor="pointer"
            ml={{ base: "12px", md: "24px" }}
          />
        </Flex>
        <Flex
          w={{ base: "60%", md: "70%" }}
          bg="primary-white-3"
          borderRadius="24px"
          h="41px"
          pos="relative"
        >
          <Input
            border="none"
            w="90%"
            pl="26px"
            outlineColor="transparent"
            _focusVisible={{ borderColor: "transparent" }}
            borderRadius="24px"
          />
          <Flex
            h="full"
            pos="absolute"
            right="13.24px"
            align="center"
            justify="center"
          >
            <SendMessageIcon cursor="pointer" />
          </Flex>
        </Flex>
        <Image alt="record audio" src="/recordAudio.svg" cursor="pointer" />
      </Flex>
    </Box>
  );
};

export default UserSelected;
