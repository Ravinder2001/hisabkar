import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  index: number;
}

const initialState: UserState = {
  index: 0,
};

const DrawerSlice = createSlice({
  name: "DrawerSlice",
  initialState,
  reducers: {
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
  },
});

export const { setIndex } = DrawerSlice.actions;
export default DrawerSlice.reducer;
