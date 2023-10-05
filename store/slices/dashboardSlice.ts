import { createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  search_query: string;
}

const initialState: DashboardState = {
  search_query: "",
};

const dashboardSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.search_query = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setSearchQuery } = dashboardSlice.actions;
export default dashboardSlice.reducer;
