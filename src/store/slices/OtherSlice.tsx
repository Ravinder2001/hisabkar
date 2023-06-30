import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  amount: number;
}

const initialState: UserState = {
  amount: 0,
};

const OtherSlice = createSlice({
  name: "OtherSlice",
  initialState,
  reducers: {
    toogleAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
  },
});

export const { toogleAmount } = OtherSlice.actions;
export default OtherSlice.reducer;
