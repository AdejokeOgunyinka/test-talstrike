import { Flex, Box, Text, Image, Input } from "@chakra-ui/react";
import MoreIconThreeDots from "@/assets/svgFiles/MoreIconThreeDots.svg.next";
import { useTypedSelector } from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import CircleIcon from "@/assets/svgFiles/Circle.svg.next";
import SendMessageIcon from "@/assets/svgFiles/SendMessage.svg.next";
import MessageComponent from "./MessageComponent";
import SearchBar from "../SearchBar";
import { useEffect, useRef, useState } from "react";
import { useGetChatChannel, loadMessages, createMessage } from "@/api/messages";
import { setChatChannel } from "@/store/slices/messagingSlice";
import Pusher from "pusher-js";
import { NewEmojiPicker } from "../EmojiPicker";

interface IMessage {
  id: string;
  user_id: string;
  message: string;
  img: string;
  time: string;
  type: string
}

const UserSelected = () => {
  const { messageUserInfo } = useTypedSelector((state) => state.messaging);
  const [showemojimodal, setShowEmojiModal] = useState(false);
  const [messages, setMessages] = useState<Record<string, IMessage>[]>([]);
  const [message, setMessage] = useState<IMessage | string>("");
  const messagesEndRef = useRef<any>(null);

  const { data: session } = useSession();
  const token = session?.user?.access;
  
  const { data: channel } = useGetChatChannel({
    token: token as string,
    receiver: messageUserInfo?.id,
  });
 

 const formatTime = (prevDate: string)=>{
  let date = new Date(prevDate);
  let hr = date.getHours();
  let mnt = date.getMinutes();
  const ampm = hr >= 12 ? "pm" : "am";
  hr = hr > 12 ? hr - 12 : hr;
  const hour = hr < 10 ? `0${hr}` : hr;
  const minutes = mnt < 10 ? `0${mnt}` : mnt;
  return `${hour}:${minutes} ${ampm}`;

 }
 

  const handleSendMessage = () => {
    let date = new Date();
    saveMessage(session?.user.access || "",session?.user?.id || "",messageUserInfo?.id, message.toString(),"TEXT", channel)

    setMessage("");
  };


  const saveMessage = (token: string, sender_id: string, recepient: string, msg: string, msg_type: string, msg_channel: string)=>{
    console.log("Token: "+token+", Sender: "+sender_id+", recepient: "+ recepient+", message: "+ msg+", type: "+ msg_type+", channel: "+ msg_channel, "...new msg...")
    createMessage({ token, sender: sender_id, receiver:recepient, message:msg, type: msg_type, channel: msg_channel });

  }



  const loadPreviousMessages = async()=>{
    const token = session?.user?.access;
    const previous_messages =  await loadMessages(token as string, channel)
    console.log(previous_messages, "...load messages...")
    //const prev_msg = previous_messages.results as unknown as IMessage
     previous_messages.results.map((msg: any)=>{

     const newmsg: any = { message:{
      id: msg.id,
      user_id: msg.sender.id,
      message: msg.message,
      img: msg.sender.image,
      time: formatTime(msg.created_at),
      type: msg.type,
     }
        
      }
     
      setMessages((prev) => [...prev, newmsg]);
    })
  //  console.log(prev_msgs, "... previous messages ...")
    
  }

  const handleTextChange = (e: any) => {
    setMessage(e.target.value);
  };

  const onKeyDownHandler = (e: any) => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  const setEmoji = ()=>{
    console.log("Emoji Selected")
  }



  useEffect(() => {
    if(channel){
      loadPreviousMessages()
      const pusher = new Pusher('7790f8bf7c4755473cb0', {
        cluster: 'mt1',
      });
      const msg_channel = pusher.subscribe(channel);

      msg_channel.bind('new-message', function (data: any) {
            const new_msg = data as IMessage
            data.time = formatTime(data.time)
            const new_data =  { message: data }
            // console.log(new_data, "...new message...")
             setMessages((prev) => [...prev, new_data]);
            
             const msg_body = new_msg.message as unknown as IMessage
             
           if(msg_body.type==="TEXT")
             saveMessage(session?.user.access || "",session?.user?.id || "",messageUserInfo?.id,new_msg.message,new_msg.type, channel) 
    
      });
    
    }  
  }, [channel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const displayEmojiModal = (e:any)=>{
    if(showemojimodal===true)
    setShowEmojiModal(false)
  else
  setShowEmojiModal(true)

   console.log(e.clientX);
    console.log(e.clientY);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
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
            isReceiver={(session?.user?.id===msg?.message?.user_id)}
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
          <Image alt="smile" src="/smile.svg" cursor="pointer" onClick={displayEmojiModal}   />
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
            onKeyDown={onKeyDownHandler}
            value={typeof message === "string" ? message : message?.message}
          />
          <Flex
            h="full"
            pos="absolute"
            right="13.24px"
            align="center"
            justify="center"
          >
            <SendMessageIcon cursor="pointer" onClick={handleSendMessage}  />
          </Flex>
        </Flex>
        <Image alt="record audio" src="/recordAudio.svg" cursor="pointer" />
      </Flex>
    </Box>
    <NewEmojiPicker onClose={()=>setShowEmojiModal(false)} onEmojiSelect={setEmoji} isOpen={showemojimodal} />
    </>
  );
};

export default UserSelected;