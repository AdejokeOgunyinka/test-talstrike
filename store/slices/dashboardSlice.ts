import { IAllPolls, IAllPosts } from "@/libs/types/dashboard";
import { createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  search_query: string;
  feed: (IAllPolls | IAllPosts)[];
}

const initialState: DashboardState = {
  search_query: "",
  feed: [],
};

const dashboardSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.search_query = action.payload;
    },
    setFeed: (state, action) => {
      state.feed = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setSearchQuery, setFeed } = dashboardSlice.actions;
export default dashboardSlice.reducer;
