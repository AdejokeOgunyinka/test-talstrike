import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const getChannel = async (token:string, receiver:string) => {
  return await axios
  .get("/auth/users/chat_connect/?receiver="+receiver, {
    headers: { Authorization: "Bearer " + token },
  });
};

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

export const useCreateMessage = () =>
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
