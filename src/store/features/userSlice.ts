import { createSlice } from "@reduxjs/toolkit";
import CONSTANTS from "../../utils/constant/Constant";

export interface userState {
  id: string;
  name: string;
  avatar: string;
  role: string;
  token: string | null;
  isUserLoggedIn: boolean;
  reDirectURL: string;
}

const initialState: userState = {
  id: "",
  name: "",
  avatar: "",
  role: "",
  token: "",
  isUserLoggedIn: false,
  reDirectURL: CONSTANTS.PROJECT_ROUTES.HOME,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserLoggedIn: (state, { payload }) => {
      state.id = payload.id;
      state.name = payload.name;
      state.avatar = payload.avatar;
      state.token = payload.token;
      state.role = payload.role;
      state.isUserLoggedIn = true;
    },
    setUserLoggedOut: (state) => {
      state.id = "";
      state.name = "";
      state.avatar = "";
      state.role = "";
      state.token = null;
      state.isUserLoggedIn = false;
    },
    setReDirectURL: (state, { payload }) => {
      state.reDirectURL = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserLoggedIn, setUserLoggedOut, setReDirectURL } = userSlice.actions;

export default userSlice.reducer;
