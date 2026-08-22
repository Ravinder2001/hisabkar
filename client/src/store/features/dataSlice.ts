import { createSlice } from "@reduxjs/toolkit";

export interface dataState {
  groupTypeList: {
    id: string;
    name: string;
    icon: string | null;
  }[];
}

const initialState: dataState = {
  groupTypeList: [],
};

export const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    setGroupTypeList: (state, { payload }) => {
      state.groupTypeList = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGroupTypeList } = dataSlice.actions;

export default dataSlice.reducer;
