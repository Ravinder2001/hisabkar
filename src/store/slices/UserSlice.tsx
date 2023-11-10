import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {}

const initialState: UserState = {};

const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {},
});

export const {} = UserSlice.actions;
export default UserSlice.reducer;
