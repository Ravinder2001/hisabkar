import { createSlice } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  name: string;
  image: string;
  token: string | null;
  isUserLoggedIn: boolean;
}

const initialState: userState = {
  id: "",
  name: "Ravinder Singh Negi",
  image: "",
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
      state.image = payload.image;
      state.token = payload.token;
      state.isUserLoggedIn = true;
    },
    setUserLoggedOut: (state) => {
      state.id = "";
      state.name = "";
      state.image = "";
      state.token = null;
      state.isUserLoggedIn = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserLoggedIn, setUserLoggedOut } = userSlice.actions;

export default userSlice.reducer;
