import { createSlice } from "@reduxjs/toolkit";

export interface dataState {
  expenseTypeList: {
    id: string;
    name: string;
    icon: string | null;
  }[];
  groupTypeList: {
    id: string;
    name: string;
    icon: string | null;
  }[];
}

const initialState: dataState = {
  expenseTypeList: [],
  groupTypeList: [],
};

export const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    setExpenseTypeList: (state, { payload }) => {
      state.expenseTypeList = payload;
    },
    setGroupTypeList: (state, { payload }) => {
      state.groupTypeList = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setExpenseTypeList, setGroupTypeList } = dataSlice.actions;

export default dataSlice.reducer;
