import { createSlice } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  name: string;
  token: string | null;
  isUserLoggedIn: boolean;
}

const initialState: userState = {
  id: "",
  name: "",
  token: "",
  isUserLoggedIn: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserLoggedIn: (state, { payload }) => {
      state.id = payload.id;
      state.name = payload.name;
      state.token = payload.token;
      state.isUserLoggedIn = true;
    },
    setUserLoggedOut: (state) => {
      state.id = "";
      state.name = "";
      state.token = null;
      state.isUserLoggedIn = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserLoggedIn, setUserLoggedOut } = userSlice.actions;

export default userSlice.reducer;
