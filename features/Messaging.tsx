import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import MessagingLayout from "@/layout/Messaging/MessagingLayout";
import NoUserSelected from "@/components/Messaging/NoUserSelected";
import MessagingMyFriends from "@/components/Messaging/MessagingMyFriends";
import { useTypedDispatch, useTypedSelector } from "@/hooks/hooks";
import { setMessagingUserId } from "@/store/slices/messagingSlice";
import UserSelected from "@/components/Messaging/UserSelected";
import MessagingPeopleNearMe from "@/components/Messaging/MessagingPeopleNearMe";

const Index = () => {
  const { messageUserId, showFriends, showPeopleNearMe } = useTypedSelector(
    (state) => state.messaging
  );
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if(!messageUserId) 
        dispatch(setMessagingUserId(""));
  }, []);

  return (
    <MessagingLayout>
      <Box w="full" h="full">
        {showPeopleNearMe ? (<MessagingPeopleNearMe />) : showFriends ? (
          <MessagingMyFriends />
        ) : messageUserId ? (
          <UserSelected />
        ) : (
          <NoUserSelected />
        )}
      </Box>
    </MessagingLayout>
  );
};

export default Index;
