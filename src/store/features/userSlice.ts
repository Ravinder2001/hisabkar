import { createSlice } from "@reduxjs/toolkit";

export interface userState {
  id: string;
  name: string;
  avatar: string;
  role: string;
  token: string | null;
  isUserLoggedIn: boolean;
  isNewUser: boolean;
}

// TEMP (remove before shipping): hardcoded session so the phone doesn't need
// Google sign-in while the LAN origin isn't registered with Google. Token is
// a real one grabbed from a normal sign-in (100d expiry, see common.controller.js).
const initialState: userState = {
  id: "1",
  name: "Ravinder",
  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=5080&gender=male",
  role: "ADMIN",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJoaXNhYmthci1zZXJ2ZXIiLCJpZCI6MSwibmFtZSI6IlJhdmluZGVyIiwicm9sZSI6IkFETUlOIiwiYXZhdGFyIjoiaHR0cHM6Ly9hcGkuZGljZWJlYXIuY29tLzcueC9hZHZlbnR1cmVyL3N2Zz9zZWVkPTUwODAmZ2VuZGVyPW1hbGUiLCJpc05ld1VzZXIiOmZhbHNlLCJpYXQiOjE3ODcyMDk1NzQsImV4cCI6MTc5NTg0OTU3NH0.nXebX8nvweMUVPxqTkhqfBXIYQxPuuFiVJ5pkEg8BjU",
  isUserLoggedIn: true,
  isNewUser: false,
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
      state.isNewUser = payload.isNewUser;
    },
    setUserLoggedOut: (state) => {
      state.id = "";
      state.name = "";
      state.avatar = "";
      state.role = "";
      state.token = null;
      state.isUserLoggedIn = false;
    },
    setUserProfileData: (state, { payload }) => {
      state.name = payload.name;
      state.avatar = payload.avatar;
    },
    toggleNewUser: (state) => {
      state.isNewUser = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserLoggedIn, setUserLoggedOut, setUserProfileData, toggleNewUser } = userSlice.actions;

export default userSlice.reducer;
