import { useMutation, useQuery } from "@tanstack/react-query";
import { axios } from "@/libs/axios";
import { User } from "@/libs/types/user";
import { ProfileApi } from "@/libs/axios";
interface LoginBody {
  email: string | undefined;
  password: string | undefined;
}

export const createUser = async (user: User) => {
  return await axios.post("/auth/users/createuser/", {
    ...user,
  });
};

export const login = async (data: LoginBody) => {
  return await axios.post(`/auth/login/`, data);
};

export const updateUserProfile = async (accessToken: string, data: any) => {
  return await ProfileApi(accessToken).updateProfile({
    ...data,
  });
};

export const updateUserInfo = async (
  accessToken: string,
  data: any,
  id: string
) => {
  return await ProfileApi(accessToken).updateUserInfo({ id, data });
};

export const useResendVerification = () =>
  useMutation((email: string) =>
    axios
      .post("/auth/users/verification/resend/", { email: email })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useSendResetPasswordToken = () =>
  useMutation((email: string) =>
    axios
      .post("/auth/users/reset_password/", { email: email })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useResetPassword = () =>
  useMutation(
    ({ token, new_password }: { token: string; new_password: string }) =>
      axios
        .post("/auth/users/reset_password/change/", {
          token: token,
          new_password: new_password,
        })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        })
  );

export const useGetSports = () =>
  useQuery(
    ["getSports"],
    () =>
      axios
        .get(`/auth/sport/`)
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

export const useVerifyEmail = () =>
  useMutation(
    (token: string) =>
      axios
        .post("/auth/users/verify/", { token: token })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { retry: 0 }
  );

export const tryGoogleSSO = async (auth_token: string) => {
  return await axios
    .post("/auth/users/social_login/google/", { auth_token: auth_token })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
};

export const verifyToken = async (token: string) => {
  return await axios.post(`/auth/verify-email-token`, { token });
};

export const loginUser = async (data: LoginBody) => {
  return await axios.post(`/auth/login/`, data);
};

export const authUser = async () => {
  return await axios.get(`/auth/profile`);
};
