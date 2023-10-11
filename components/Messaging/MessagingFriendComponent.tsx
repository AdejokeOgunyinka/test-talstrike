import { Box, Flex, Text } from "@chakra-ui/react";
import RiCheckDoubleLineIcon from "@/assets/svgFiles/RiCheckDoubleLine.svg.next";
import MessagePendingIcon from "@/assets/svgFiles/MessagePending.svg.next";
import PeopleComponent from "./PeopleComponent";
import {
  setMessagingUserId,
  setMessagingUserInfo,
  setShowFriends,
  setShowPeopleNearMe,
} from "@/store/slices/messagingSlice";
import { useTypedDispatch } from "@/hooks/hooks";

export interface IMessagingFriendComponent {
  img: string;
  id: string;
  name: string;
  lastMessage?: string;
  time: string;
  userStatus: string;
  messageStatus?: string;
  numberOfUnreadMessages?: number;
  currentlyTyping?: boolean;
}

const MessagingFriendComponent = ({
  img,
  id,
  name,
  lastMessage,
  time,
  userStatus,
  messageStatus,
  numberOfUnreadMessages,
  currentlyTyping,
}: IMessagingFriendComponent) => {
  const dispatch = useTypedDispatch();

  return (
    <Flex
      align="center"
      justify="space-between"
      cursor="pointer"
      onClick={() => {
        dispatch(setShowFriends(false));
        dispatch(setShowPeopleNearMe(false));
        dispatch(setMessagingUserId(id));
        dispatch(
          setMessagingUserInfo({
            name,
            img,
            userStatus,
            currentlyTyping,
          })
        );
      }}
    >
      <Flex gap="6.02px">
        <PeopleComponent img={img} id={id} withoutName status={userStatus} />
        <Box>
          <Text mb="4px">{name}</Text>
          <Text
            fontStyle={currentlyTyping ? "italic" : "normal"}
            fontSize="10px"
            fontWeight="400"
            lineHeight="14px"
            color="grey-1"
          >
            {currentlyTyping ? "Typing..." : lastMessage}
          </Text>
        </Box>
      </Flex>
      <Flex
        direction="column"
        justify="space-between"
        align="center"
        gap="7.5px"
      >
        <Text color="grey-1" fontSize="10px" lineHeight="14px" fontWeight="400">
          {time}
        </Text>
        {messageStatus === "unread" ? (
          <Flex
            w="13.05px"
            h="13px"
            borderRadius="100%"
            bg="red"
            justify="center"
            align="center"
            fontSize="8px"
            lineHeight="14px"
            fontWeight="400"
            color="primary-white-3"
          >
            {numberOfUnreadMessages}
          </Flex>
        ) : messageStatus === "pending" ? (
          <MessagePendingIcon />
        ) : (
          <RiCheckDoubleLineIcon />
        )}
      </Flex>
    </Flex>
  );
};

export default MessagingFriendComponent;
