import { useQuery, useMutation } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const useGetAllPlayers = ({
  token,
  age,
  gender,
  location,
  sport,
  position,
}: {
  token: string;
  age?: string;
  location?: string;
  gender?: string;
  sport?: string;
  position?: string;
}) =>
  useQuery(
    ["getAllPlayers", token, age, gender, location, sport, position],
    () =>
      axios
        .get(
          `/auth/users/profile?roles=TALENT${age ? `&age=${age}` : ""}${
            gender ? `&gender=${gender}` : ""
          }${location ? `&location=${location}` : ""}${
            position ? `&position=${position}` : ""
          }${sport ? `&sport=${sport}` : ""}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        })
  );

interface IUser {
  userId: string;
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
