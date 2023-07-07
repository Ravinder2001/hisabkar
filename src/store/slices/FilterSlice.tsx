import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface FilterState {
  groupMembers: { member_id: string; member_name: string }[];
  senderFilter: string;
  receiverFilter: string;
}

const initialState: FilterState = {
  groupMembers: [],
  senderFilter: "All",
  receiverFilter: "All",
};

const FilterSlice = createSlice({
  name: "FilterSlice",
  initialState,
  reducers: {
    addGroupMembers: (
      state,
      action: PayloadAction<{ member_id: string; member_name: string }[]>
    ) => {
      state.groupMembers = action.payload;
    },
    handleSender: (state, action: PayloadAction<string>) => {
      state.senderFilter = action.payload;
    },
    handleReceiver: (state, action: PayloadAction<string>) => {
      state.receiverFilter = action.payload;
    },
    handleReset: (state) => {
      state.senderFilter = "All";
      state.receiverFilter = "All";
    },
  },
});

export const { addGroupMembers, handleSender, handleReceiver,handleReset } =
  FilterSlice.actions;
export default FilterSlice.reducer;
