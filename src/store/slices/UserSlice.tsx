import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  id: string;
  name: string;
  image: string;
  user: boolean;
  guestUser: boolean;
}

const initialState: UserState = {
  id: "",
  name: "",
  image: "",
  user: false,
  guestUser: false,
};
type AddUserProps = {
  name: string;
  id: string;
  image: string;
};

const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<AddUserProps>) => {
      const { id, name, image } = action.payload;
      state.id = id;
      state.image = image;
      state.name = name;
      state.user = true;
      state.guestUser = false;
    },
    Logout: (state) => {
      state.id = "";
      state.image = "";
      state.name = "";
      state.user = false;
      state.guestUser = false;
    },
    addGuestUser: (state) => {
      const num1 = Math.floor(Math.random() * 100);
      const image = `https://api.multiavatar.com/${num1}.png`;
      state.guestUser = true;
      state.name = "Guest User";
      state.image = image;
    },
  },
});

export const { addUser, Logout, addGuestUser } = UserSlice.actions;
export default UserSlice.reducer;
