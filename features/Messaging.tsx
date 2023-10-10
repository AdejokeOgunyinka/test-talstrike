import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import MessagingLayout from "@/layout/Messaging/MessagingLayout";
import NoUserSelected from "@/components/Messaging/NoUserSelected";
import { useTypedDispatch, useTypedSelector } from "@/hooks/hooks";
import { setMessagingUserId } from "@/store/slices/messagingSlice";
import UserSelected from "@/components/Messaging/UserSelected";

const Index = () => {
  const { messageUserId } = useTypedSelector((state) => state.messaging);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    dispatch(setMessagingUserId(""));
  }, []);

  return (
    <MessagingLayout>
      <Box w="full" h="full">
        {messageUserId ? <UserSelected /> : <NoUserSelected />}
      </Box>
    </MessagingLayout>
  );
};

export default Index;
