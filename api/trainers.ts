import { useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllTrainers = ({
  token,
  age,
  gender,
  location,
  specialty,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  specialty?: string;
}) =>
  useQuery(["getAllTrainers", token, age, gender, location, specialty], () =>
    axios
      .get(
        `/auth/users/profile?roles=TRAINER${age ? `&age=${age}` : ""}${
          gender ? `&gender=${gender}` : ""
        }${location ? `&location=${location}` : ""}${
          specialty ? `&specialty=${specialty}` : ""
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
