import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useAddViewCount = () =>
  useMutation(
    ({
      view_time,
      post,
      token,
    }: {
      view_time: number;
      post: string;
      token: string;
    }) =>
      axios
        .post(
          "/post/view/",
          { view_time: view_time, post: post },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        })
  );

export const useGetExploreForYou = () =>
  useQuery(["getExploreForYou"], () =>
    axios
      .get(`/explore/latest`)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useGetExploreTop = () =>
  useQuery(["getExploreTop"], () =>
    axios
      .get(`/explore/top`)
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );
