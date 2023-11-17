import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface UserState {
  group_name: string;
  group_type: string;
  group_members: { id: string; name: string; avatar: string }[];
  expenses: {
    id: string;
    amount: number;
    paidByName: string;
    paidById: string;
    amountPerPerson: number;
    members: { id: string; name: string; avatar: string; amount: number }[];
  }[];
}

const initialState: UserState = {
  group_name: "",
  group_type: "",
  group_members: [],
  expenses: [],
};

const StoreExpenseSlice = createSlice({
  name: "StoreExpenseSlice",
  initialState,
  reducers: {
    CreateGroup: (state, action: PayloadAction<{ name: string; type: string }>) => {
      state.group_name = action.payload.name;
      state.group_type = action.payload.type;
    },
    AddGroupMembers: (state, action: PayloadAction<{ id: string; name: string; avatar: string }[]>) => {
      state.group_members.push(...action.payload);
    },
    AddExpense: (
      state,
      action: PayloadAction<{
        id: string;
        amount: number;
        paidByName: string;
        paidById: string;
        amountPerPerson: number;
        members: { id: string; name: string; avatar: string; amount: number }[];
      }>
    ) => {
      state.expenses.push(action.payload);
    },
  },
});

export const { CreateGroup, AddGroupMembers, AddExpense } = StoreExpenseSlice.actions;
export default StoreExpenseSlice.reducer;
