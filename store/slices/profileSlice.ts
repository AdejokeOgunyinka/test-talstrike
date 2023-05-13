import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { handleResponseError } from "@/libs/errorHandler";
import { AxiosError } from "axios";
import { getProfile } from "@/api/profile";

export const getUserProfile = createAsyncThunk(
  "profile/user",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await getProfile({ id });
      return data;
    } catch (err) {
      const error = err as AxiosError;
      const message = handleResponseError(error, "Error");
      throw rejectWithValue(message);
    }
  }
);

type IProfileResponse = {
  id: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    image: string;
    roles: string[];
  };
  followers: number;
  following: number;
  likes: number;
  is_following: boolean;
  gender: string;
  phone_number: string;
  trainings: string;
  achievements: { title: string; year: string; description: string }[];
  teams: string[];
  interests: string[];
  date_of_birth: string;
  abilities: string[];
  skills: string[];
  position: string;
  biography: string;
  career_goals: string[];
  years_of_experience: number;
  sport: string;
  location: string[];
  created_at: string;
  socials?: {
    linkedin: string;
    facebook: string;
    twitter: string;
    instagram: string;
  };
} | null;

interface ProfileState {
  userInfo: {
    loading: boolean;
    error: string;
    profile: IProfileResponse;
  } | null;
}

const initialState: ProfileState = {
  userInfo: null,
};

const profileSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.userInfo = {
        loading: false,
        error: "",
        profile: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state, action) => {
        state.userInfo = {
          loading: true,
          profile: null,
          error: "",
        };
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userInfo = {
          profile: action.payload,
          error: "",
          loading: false,
        };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.userInfo = {
          loading: false,
          error: action.payload as string,
          profile: null,
        };
      });
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
