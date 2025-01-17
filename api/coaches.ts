import { useInfiniteQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllCoaches = ({
  token,
  age,
  gender,
  location,
  sport,
  search,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  sport?: string;
  search?: string;
}) =>
  useInfiniteQuery(
    ["getAllCoaches", token, age, gender, location, sport, search],
    ({ pageParam = 1 }) =>
      axios
        .get(
          `/auth/users/profile?roles=COACH${age ? `&age=${age}` : ""}${
            gender ? `&gender=${gender}` : ""
          }${location ? `&location=${location}` : ""}${
            search ? `&search=${search}` : ""
          }${sport ? `&sport=${sport}` : ""}${
            pageParam ? `&page=${pageParam}` : ""
          }`,
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
