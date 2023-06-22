import { useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllAgents = ({
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
  useQuery(["getAllAgents", token, age, gender, location, sport, page], () =>
    axios
      .get(
        `/auth/users/profile?roles=AGENT${age ? `&age=${age}` : ""}${
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
