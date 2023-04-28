import { useMutation } from "@tanstack/react-query";
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

export const nextAuthOauthLogin = async ({
  user,
  account,
  profile,
}: {
  user: any;
  account: any;
  profile: any;
}) => {
  return await axios.post("/auth/signin/oauth", {
    user,
    account,
    profile,
  });
};

export const getUserByProviderAndProviderAccountId = async (
  providerAccountId: any,
  provider: any
) => {
  return await axios.post("/auth/signin/provider", {
    providerAccountId,
    provider,
  });
};

export const getUserByEmail = async (email: string) => {
  return await axios.post("/auth/signin/email", {
    email,
  });
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

export const verifyToken = async (token: string) => {
  return await axios.post(`/auth/verify-email-token`, { token });
};

export const loginUser = async (data: LoginBody) => {
  return await axios.post(`/auth/login/`, data);
};

export const authUser = async () => {
  return await axios.get(`/auth/profile`);
};
