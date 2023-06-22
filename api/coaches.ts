import { useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllCoaches = ({
  token,
  age,
  gender,
  location,
  sport,
  page,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  sport?: string;
  page?: number;
}) =>
  useQuery(["getAllCoaches", token, age, gender, location, sport, page], () =>
    axios
      .get(
        `/auth/users/profile?roles=COACH${age ? `&age=${age}` : ""}${
          gender ? `&gender=${gender}` : ""
        }${location ? `&location=${location}` : ""}${
          sport ? `&sport=${sport}` : ""
        }${page ? `&page=${page}` : ""}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );
