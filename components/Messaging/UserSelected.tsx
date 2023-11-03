import { Flex, Box, Text, Image, Input } from "@chakra-ui/react";
import MoreIconThreeDots from "@/assets/svgFiles/MoreIconThreeDots.svg.next";
import { useTypedSelector } from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import CircleIcon from "@/assets/svgFiles/Circle.svg.next";
import SendMessageIcon from "@/assets/svgFiles/SendMessage.svg.next";
import MessageComponent from "./MessageComponent";
import SearchBar from "../SearchBar";
import { useEffect, useRef, useState } from "react";
import { useGetChatChannel } from "@/api/messages";
import { setChatChannel } from "@/store/slices/messagingSlice";

interface IMessage {
  id: string;
  message: string;
  img: string;
  time: string;
}

const UserSelected = () => {
  const { messageUserInfo } = useTypedSelector((state) => state.messaging);
  const [websock, setWebSock] = useState<any>();
  const [messages, setMessages] = useState<Record<string, IMessage>[]>([]);
  const [message, setMessage] = useState<IMessage | string>("");
  const messagesEndRef = useRef<any>(null);

  const { data: session } = useSession();
  const token = session?.user?.access;
  const { data: channel } = useGetChatChannel({
    token: token as string,
    receiver: messageUserInfo?.id,
  });

  const handleSendMessage = () => {
    let date = new Date();
    let hr = date.getHours();
    let mnt = date.getMinutes();
    const ampm = hr >= 12 ? "pm" : "am";
    hr = hr > 12 ? hr - 12 : hr;
    const hour = hr < 10 ? `0${hr}` : hr;
    const minutes = mnt < 10 ? `0${mnt}` : mnt;

    websock.send(
      JSON.stringify({
        message: {
          id: Date.now(),
          message: message,
          img: session?.user?.image,
          time: `${hour}:${minutes} ${ampm}`,
        },
      })
    );

    setMessage("");
  };

  const handleTextChange = (e: any) => {
    setMessage(e.target.value);
  };

  const url = "ws://143.244.179.156:8000/ws/chat/emmy_lobby/";

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = (event) => {
      setChatChannel(channel);
      setWebSock(ws);
    };

    ws.onmessage = function (event) {
      const json = JSON.parse(event.data);
      setMessages((prev) => [...prev, json]);
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      } else {
        ws.addEventListener("open", () => {
          ws.close();
        });
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        className="h-[calc(88vh-55px)] msgparent"
        overflowY="scroll"
        padding={{ base: "18px 12px 120px 12px", md: "28px 18px 50px 18px" }}
      >
        {messages.map((msg, index) => (
          <MessageComponent
            key={index}
            isReceiver
            userImg={msg?.message?.img}
            time={msg?.message?.time}
            status="sent"
          >
            <Text fontSize="16px">{msg?.message?.message}</Text>
          </MessageComponent>
        ))}
        <Box ref={messagesEndRef}></Box>
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
            onChange={handleTextChange}
            value={typeof message === "string" ? message : message?.message}
          />
          <Flex
            h="full"
            pos="absolute"
            right="13.24px"
            align="center"
            justify="center"
          >
            <SendMessageIcon cursor="pointer" onClick={handleSendMessage} />
          </Flex>
        </Flex>
        <Image alt="record audio" src="/recordAudio.svg" cursor="pointer" />
      </Flex>
    </Box>
  );
};

export default UserSelected;
