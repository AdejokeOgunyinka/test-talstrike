import { useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllAgents = ({
  token,
  age,
  gender,
  location,
  sport,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  sport?: string;
}) =>
  useQuery(["getAllAgents", token, age, gender, location, sport], () =>
    axios
      .get(
        `/auth/users/profile?roles=AGENT${age ? `&age=${age}` : ""}${
          gender ? `&gender=${gender}` : ""
        }${location ? `&location=${location}` : ""}${
          sport ? `&sport=${sport}` : ""
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
