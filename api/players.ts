import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllPlayers = ({
  token,
  age,
  gender,
  location,
  sport,
  position,
  search,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  sport?: string;
  position?: string;
  search?: string;
}) =>
  useInfiniteQuery(
    ["getAllPlayers", token, age, gender, location, sport, position, search],
    ({ pageParam = 1 }) =>
      axios
        .get(
          `/auth/users/profile?roles=TALENT${age ? `&age=${age}` : ""}${
            gender ? `&gender=${gender}` : ""
          }${location ? `&location=${location}` : ""}${
            position ? `&position=${position}` : ""
          }${sport ? `&sport=${sport}` : ""}${
            search ? `&search=${search}` : ""
          }${pageParam ? `&page=${pageParam}` : ""}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => res.data?.results)
        .catch((err) => {
          throw err.response.data;
        }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage =
          lastPage.length === 20 ? allPages.length + 1 : undefined;
        return nextPage;
      },
    }
  );

interface IUser {
  userId: string;
  token: string;
}

interface IIgnore {
  ignored: string;
  token: string;
}
export const useFollowUser = () =>
  useMutation(({ userId, token }: IUser) =>
    axios
      .post(
        "/auth/users/follow/",
        { user: userId },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useIgnoreUser = () =>
  useMutation(({ ignored, token }: IIgnore) =>
    axios
      .post(
        "/auth/users/ignore/",
        { ignored },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );
