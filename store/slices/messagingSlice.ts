/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

interface MessagingState {
  messageUserId: string;
  messageUserInfo: any;
  showFriends: boolean;
  showPeopleNearMe: boolean;
}

const initialState: MessagingState = {
  messageUserId: "",
  messageUserInfo: null,
  showFriends: false,
  showPeopleNearMe: false,
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
    setShowFriends: (state, action) => {
      state.showFriends = action.payload;
    },
    setShowPeopleNearMe: (state, action) => {
      state.showPeopleNearMe = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setMessagingUserId,
  setMessagingUserInfo,
  setShowFriends,
  setShowPeopleNearMe,
} = messagingSlice.actions;

export default messagingSlice.reducer;
