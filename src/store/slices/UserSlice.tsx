import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  id: string;
  username: string;
  image: string;
  status: boolean;
}

const initialState: UserState = {
  id: "",
  username: "",
  image: "",
  status: false,
};

const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    AddUser: (state, action: PayloadAction<{ id: string; username: string; image: string }>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.image = action.payload.image;
      state.status = true;
    },
    Logout: (state) => {
      state.id = "";
      state.username = "";
      state.image = "";
      state.status = false;
    },
  },
});

export const { AddUser, Logout } = UserSlice.actions;
export default UserSlice.reducer;
