/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

interface MessagingState {
  messageUserId: string;
  messageUserInfo: any;
}

const initialState: MessagingState = {
  messageUserId: "",
  messageUserInfo: null,
};

const messagingSlice = createSlice({
  name: "messaging",
  initialState,
  reducers: {
    setMessagingUserId: (state, action) => {
      state.messageUserId = action.payload;
    },
    setMessagingUserInfo: (state, action) => {
      state.messageUserInfo = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setMessagingUserId, setMessagingUserInfo } =
  messagingSlice.actions;
export default messagingSlice.reducer;
