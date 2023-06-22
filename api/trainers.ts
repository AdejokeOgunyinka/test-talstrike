import { useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllTrainers = ({
  token,
  age,
  gender,
  location,
  specialty,
  sport,
  page,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  specialty?: string;
  sport?: string;
  page?: number;
}) =>
  useQuery(
    ["getAllTrainers", token, age, gender, location, specialty, sport, page],
    () =>
      axios
        .get(
          `/auth/users/profile?roles=TRAINER${age ? `&age=${age}` : ""}${
            gender ? `&gender=${gender}` : ""
          }${location ? `&location=${location}` : ""}${
            sport ? `&sport=${sport}` : ""
          }${specialty ? `&specialty=${specialty}` : ""}${
            page ? `&page=${page}` : ""
          }`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        })
  );
