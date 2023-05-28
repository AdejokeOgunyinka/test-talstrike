import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";
import { ProfileBody } from "@/libs/types/profile";

export const getProfile = async ({ id }: { id: string }) => {
  return await axios.get(`/auth/users/${id}/profile/`);
};

export const updateProfile = async (data: ProfileBody) => {
  return await axios.post("/auth/users/profile/", data);
};

export const useUpdateMyProfile = () =>
  useMutation(({ token, data }: { data: any; token: string }) =>
    axios
      .patch(`/auth/users/profile/me/`, data, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useCreatePoll = () =>
  useMutation(({ token, data }: { data: any; token: string }) =>
    axios
      .post("/poll/", data, {
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

export const useGetPollsByUserId = ({ token, userId }: IGetPosts) =>
  useQuery(
    ["getPollsByUserId", token, userId],
    () =>
      axios
        .get(`/poll/?author=${userId}`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnWindowFocus: false }
  );

export const useCommentOnPoll = () =>
  useMutation(
    ({ pollId, token, body }: { token: string; body: any; pollId: string }) =>
      axios
        .post(`/poll/${pollId}/create_comment/`, body, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        })
  );

export const useGetAllCommentsOnPoll = ({
  token,
  pollId,
}: {
  token: string;
  pollId: string;
}) =>
  useQuery(
    ["getAllCommentsOnPoll", token, pollId],
    () =>
      axios
        .get(`/poll/${pollId}/get_comments/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { refetchOnMount: false }
  );

export const useVotePollChoice = () =>
  useMutation(
    ({ token, pollId, data }: { data: any; pollId: string; token: string }) =>
      axios
        .post(`/poll/${pollId}/vote/`, data, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        })
  );

export const useUpdateMyProfileImage = () =>
  useMutation(
    ({ token, data, userId }: { token: string; userId: string; data: any }) =>
      axios
        .patch(`/auth/users/${userId}/`, data, {
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

export const useGetAchievements = ({ token, userId }: IGetPosts) =>
  useQuery(
    ["getAchievements", token, userId],
    () =>
      axios
        .get(`/auth/achievement/?user=${userId}`, {
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

export const useGetSingleAchievement = ({
  token,
  id,
}: {
  token: string;
  id: string;
}) =>
  useQuery(
    ["getSingleAchievement", token, id],
    () =>
      axios
        .get(`/auth/achievement/${id}`, {
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

export const useCreateAchievement = () =>
  useMutation(({ token, body }: { token: string; body: any }) =>
    axios
      .post(`/auth/achievement/`, body, {
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

export const useEditAchievement = () =>
  useMutation(({ token, body, id }: { token: string; body: any; id: string }) =>
    axios
      .patch(`/auth/achievement/${id}/`, body, {
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

export const useDeleteAchievement = () =>
  useMutation(({ id, token }: { id: string; token: string }) =>
    axios
      .delete(`/auth/achievement/${id}/`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useGetUserPhotos = ({ token, userId }: IGetPosts) =>
  useQuery(
    ["getPhotos", token, userId],
    () =>
      axios
        .get(`/auth/users/${userId}/photos/`, {
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

export const useGetAppearances = ({ token, userId }: IGetPosts) =>
  useQuery(
    ["getAppearances", token, userId],
    () =>
      axios
        .get(`/auth/appearance/?user=${userId}`, {
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

export const useCreateAppearance = () =>
  useMutation(({ token, body }: { token: string; body: any }) =>
    axios
      .post(`/auth/appearance/`, body, {
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

export const useEditAppearance = () =>
  useMutation(({ token, body, id }: { token: string; body: any; id: string }) =>
    axios
      .patch(`/auth/appearance/${id}/`, body, {
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

export const useDeleteAppearance = () =>
  useMutation(({ id, token }: { id: string; token: string }) =>
    axios
      .delete(`/auth/appearance/${id}/`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
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
