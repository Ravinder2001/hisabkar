import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  id: string;
  name: string;
  image: string;
  user: boolean;
}

const initialState: UserState = {
  id: "",
  name: "",
  image: "",
  user: false,
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
    },
    Logout: (state) => {
      state.id = "";
      state.image = "";
      state.name = "";
      state.user = false;
    },
  },
});

export const { addUser, Logout } = UserSlice.actions;
export default UserSlice.reducer;
