import Axios from "axios";
import config from "./config";
import { ProfileBody } from "./types/profile";

export const axios = Axios.create({
  baseURL: config.API_URL,
});

export const ProfileApi = (token: string) => {
  const instance = Axios.create({
    baseURL: config.API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    getUser: async ({ id }: { id: string }) => {
      return await instance.get(`/auth/users/${id}/`);
    },
    updateProfile: async (data: ProfileBody) => {
      return await instance.patch("/auth/users/profile/me/", data);
    },
    updateUserInfo: async ({ data, id }: { data: any; id: string }) => {
      return await instance.patch(`/auth/users/${id}/`, data);
    },
  };
};
