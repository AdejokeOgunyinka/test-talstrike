import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllTrainers = ({
  token,
  age,
  gender,
  location,
  specialty,
  sport,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  specialty?: string;
  sport?: string;
}) =>
  useInfiniteQuery(
    ["getAllTrainers", token, age, gender, location, specialty, sport],
    ({ pageParam = 1 }) =>
      axios
        .get(
          `/auth/users/profile?roles=TRAINER${age ? `&age=${age}` : ""}${
            gender ? `&gender=${gender}` : ""
          }${location ? `&location=${location}` : ""}${
            sport ? `&sport=${sport}` : ""
          }${specialty ? `&specialty=${specialty}` : ""}${
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
