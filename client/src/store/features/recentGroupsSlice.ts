import { createSlice } from "@reduxjs/toolkit";

export interface RecentGroupPreview {
  group_name: string;
  net_balance: number;
  is_settled: boolean;
}

export interface recentGroupsState {
  groups: RecentGroupPreview[];
}

const initialState: recentGroupsState = {
  groups: [],
};

// Snapshot of the user's top groups, refreshed every time Home loads. It's
// persisted (see store.ts) so the sign-in screen can show it after logout
// without an extra fetch — see SignIn.tsx.
export const recentGroupsSlice = createSlice({
  name: "recentGroupsSlice",
  initialState,
  reducers: {
    setRecentGroupsPreview: (state, { payload }) => {
      state.groups = payload;
    },
  },
});

export const { setRecentGroupsPreview } = recentGroupsSlice.actions;

export default recentGroupsSlice.reducer;
