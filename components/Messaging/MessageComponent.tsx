import { Box, Flex, Text, Image } from "@chakra-ui/react";

const MessageComponent = ({
  children,
  isSender,
  isReceiver,
  hasMedia,
  time,
  userImg,
  status,
}: {
  children: React.ReactNode;
  isSender?: boolean;
  isReceiver?: boolean;
  hasMedia?: boolean;
  time: string;
  userImg: string;
  status?: string;
}) => {
  return (
    <Flex justify={isSender ? "flex-start" : isReceiver ? "flex-end" : "start"}>
      <Flex align="start" gap="4.85px">
        <Image
          alt="avatar"
          src={userImg}
          width="40.155px"
          height="40px"
          boxShadow="0px 0px 13px 0px rgba(0, 0, 0, 0.10)"
          border={"2px solid"}
          borderColor="primary-white-3"
          borderRadius="100%"
        />
        <Box w="80%">
          <Box
            p={hasMedia ? "16px 24px" : "10px 48px 16px 12px"}
            bg={
              isSender ? "dark-blue" : isReceiver ? "primary-white-3" : "stroke"
            }
            border={isReceiver ? "1px solid" : "none"}
            borderColor="stroke"
            borderRadius={
              isSender
                ? "0px 8px 8px 8px"
                : isReceiver
                ? "8px 0px 8px 8px"
                : "8px"
            }
            pos="relative"
          >
            {children}
            {isReceiver && (
              <Image
                src={
                  status === "sent"
                    ? "/messageIsSent.svg"
                    : status === "pending"
                    ? "/messageIsPending.svg"
                    : ""
                }
                alt="status"
                pos="absolute"
                right="7px"
                bottom="4px"
              />
            )}
          </Box>
          <Text
            mt="9px"
            color="grey-1"
            fontSize="10px"
            fontWeight="400"
            lineHeight="14px"
          >
            {time}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MessageComponent;
