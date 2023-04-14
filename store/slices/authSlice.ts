/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authUser } from "@/api/auth";

export const getAuthUser = createAsyncThunk("auth/user", async () => {
  const { data } = await authUser();
  return data;
});

interface UserState {
  authenticated: boolean;
  loading: boolean;
  userInfo: {
    user: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
      roles: string[];
      date_joined: string;
      is_active: boolean;
    };
    access: string;
    refresh: string;
  } | null;
}

const initialState: UserState = {
  authenticated: false,
  loading: false,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.userInfo = action.payload;
      state.authenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.authenticated = true;
      })
      .addCase(getAuthUser.rejected, (state, action) => {
        state.authenticated = false;
        state.userInfo = null;
        state.loading = false;
      });
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
