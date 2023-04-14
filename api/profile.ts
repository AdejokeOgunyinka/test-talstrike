import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";
import { ProfileBody } from "@/libs/types/profile";

export const getProfile = async ({ id }: { id: string }) => {
  return await axios.get(`/auth/users/${id}/profile/`);
};

export const updateProfile = async (data: ProfileBody) => {
  return await axios.post("/auth/users/profile/", data);
};

interface IGetPosts {
  token: string;
  userId: string;
  post_type?: string;
}

export const useGetPosts = ({ token, userId }: IGetPosts) =>
  useQuery(
    ["getMyPosts", token, userId],
    () =>
      axios
        .get(`/post/${userId}/all`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnWindowFocus: false }
  );

export const useGetPostsByType = ({ token, userId, post_type }: IGetPosts) =>
  useQuery(
    ["getMyPostsByType", token, userId, post_type],
    () =>
      axios
        .get(`/post/${userId}/all?post_type=${post_type}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnWindowFocus: false }
  );

export const useGetSinglePost = ({
  token,
  postId,
}: {
  token: string;
  postId: string;
}) =>
  useQuery(
    ["getSinglePost", token, postId],
    () =>
      axios
        .get(`/post/${postId}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnWindowFocus: false }
  );

export const useGetMyProfile = ({ token, userId }: IGetPosts) =>
  useQuery(
    ["getMyProfile", token, userId],
    () =>
      axios
        .get(`/auth/users/${userId}/profile/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

export const useDeletePost = () =>
  useMutation(({ postId, token }: { postId: string; token: string }) =>
    axios
      .delete(`/post/${postId}/`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useEditPost = () =>
  useMutation(({ token, body, id }: { token: string; body: any; id: string }) =>
    axios
      .patch(`/post/${id}/`, body, {
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
