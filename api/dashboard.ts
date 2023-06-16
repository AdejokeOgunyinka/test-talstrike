import { useQuery, useMutation } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetNewsfeed = ({
  token,
  page,
}: {
  token: string;
  page?: number;
}) =>
  useQuery(
    ["getNewsfeed", token, page],
    () =>
      axios
        .get(`/post/newsfeed/personalized?page=${page || 1}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnMount: false, retry: 1 }
  );

export const useGetAllPolls = ({
  token,
  page,
}: {
  token: string;
  page?: number;
}) =>
  useQuery(
    ["getPolls", token, page],
    () =>
      axios
        .get(`/poll?page=${page || 1}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnMount: false, retry: 1 }
  );

export const useGetPeopleNearMe = (token: string) =>
  useQuery(["getPeopleNearMe", token], () =>
    axios
      .get("/auth/users/people_near_me", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useGetAllCommentsOnPost = ({
  token,
  postId,
}: {
  token: string;
  postId: string;
}) =>
  useQuery(
    ["getAllCommentsOnPost", token, postId],
    () =>
      axios
        .get(`/post/${postId}/comments/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnMount: false, enabled: !!postId }
  );

interface IPost {
  postId?: string;
  token: string;
  body?: any;
  additionalHeaders?: any;
}
export const useLikeUnlikePost = () =>
  useMutation(({ postId, token }: IPost) =>
    axios
      .post(
        "/post/like/",
        { post: postId },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useCommentOnPost = () =>
  useMutation(({ postId, token, body }: IPost) =>
    axios
      .post(
        "/post/comment/",
        { post: postId, body: body },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useCreatePost = () =>
  useMutation(({ token, body, additionalHeaders }: IPost) =>
    axios
      .post("/post/", body, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
          ...(additionalHeaders && additionalHeaders),
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useGetSuggestedFollows = (token: string) =>
  useQuery(
    ["getSuggestedFollows", token],
    () =>
      axios
        .get("/auth/users/suggested_follows/", {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnMount: false, retry: 1 }
  );

export const useGetMyFollowers = ({
  token,
  id,
}: {
  token: string;
  id: string;
}) =>
  useQuery(
    ["getMyFollowers", token, id],
    () =>
      axios
        .get(`/auth/users/${id}/followers`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnMount: false, retry: 1 }
  );
