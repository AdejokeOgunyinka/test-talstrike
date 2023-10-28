/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

interface MessagingState {
  messageUserId: string;
  messageUserInfo: any;
  chatChannel: string;
  showFriends: boolean;
  showPeopleNearMe: boolean;
}

const initialState: MessagingState = {
  messageUserId: "",
  messageUserInfo: null,
  chatChannel:"",
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
    setChatChannel: (state, action) => {
      state.chatChannel = action.payload;
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
  setChatChannel,
  setShowFriends,
  setShowPeopleNearMe,
} = messagingSlice.actions;

export default messagingSlice.reducer;
