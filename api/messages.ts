import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const getChannel = async (token:string, receiver:string) => {
  return await axios
  .get("/auth/users/chat_connect/?receiver="+receiver, {
    headers: { Authorization: "Bearer " + token },
  });
};

export const loadMessages = async (token:string, channel:string) => {
  const res = await axios
  .get("/auth/users/load_messages/?channel="+channel, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
};

export const useLoadMessages = ({
  token,
  channel,
}: {
  token: string;
  channel: string;
}) =>
  useQuery(["loadMessages", token], () =>
    axios
      .get("/auth/users/load_messages/?channel="+channel, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useGetChatChannel = ({
  token,
  receiver,
}: {
  token: string;
  receiver: string;
}) =>
  useQuery(["getChatChannel", token], () =>
    axios
      .get("/auth/users/chat_connect/?receiver="+receiver, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

  interface IMessage {
    token: string
    sender: string;
    receiver: string;
    message: string;
    type: string;
    channel: string;
  }


export const createMessage = ({ token, sender, receiver, message, type, channel }: IMessage) =>{
  console.log(token, "..token...")
  axios
  .post("/auth/users/send_message/", {
    sender,
    receiver,
    message,
    type,
    channel
  },{ headers: { Authorization: "Bearer " + token } })
  .then((res) => res.data)
  .catch((err) => {
    throw err.response.data;
  })

}


export const useCreateMessage = ({ token, sender, receiver, message, type, channel }: IMessage) =>
  useMutation(({ token, sender, receiver, message, type, channel }: IMessage) =>
    axios
      .post("/send_message/", {
        sender,
        receiver,
        message,
        type,
        channel
      }, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );
